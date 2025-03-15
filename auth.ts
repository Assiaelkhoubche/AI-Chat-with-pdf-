import NextAuth, { User as UserNextAuth } from "next-auth";

import connectDB from "./lib/db";
import bcrypt from "bcryptjs";
import { User } from "./lib/models/User";
import jwt from "jsonwebtoken";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

interface CustomUser extends UserNextAuth {
  id: string;
  email?: string;
  name?: string;
  image?: string;
  token: string;
  hasAciveMembership?: boolean;
}

declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
      hasAciveMembership?: boolean;
    };
  }
}
export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,

  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      authorize: async (credentials) => {
        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("User not found");
        }
        const isValide = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!isValide) {
          throw new Error("Invalid credentials");
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
          expiresIn: "7d",
        });
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.userName,
          image: user.image,
          hasAciveMembership: user.hasAciveMembership,
          token,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as CustomUser).token;
        token.id = user.id;
        token.image = user.image;
        token.name = user.name;
        token.hasAciveMembership = user.hasAciveMembership;
      }
      return token;
    },
    async session({ session, token }) {    
      session.accessToken = token.accessToken as string;
      session.user.id = token.id as string;
      session.user.image = token.image as string;
      session.user.name = token.name as string;
      session.user.hasAciveMembership = token.hasAciveMembership as boolean;
      return session;
    },

    signIn: async ({ user, account }) => {
      const password = process.env.PASSWORD;
      const saltRounds = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password!, saltRounds);

      if (account?.provider === "google") {
        try {
          const { email, name, image, id } = user;
          await connectDB();
          const alreadyUser = await User.findOne({ email });
          console.log("already: ", alreadyUser);

          if (!alreadyUser) {
            await User.create({
              email,
              userName: name,
              image,
              password: hashedPassword,
              authProviderId: { id: id, providerName: "Google" },
            });
          }

          return true;
        } catch (error) {
          throw new Error("Error while creating user");
        }
      } else if (account?.provider === "credentials") {
        return true;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
});
