import Link from "next/link";
import { register, GitHubLogin, GoogleLogin } from "@/action/user";
import { FaGithub } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";

const SignUp = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Sign Up
        </h2>

        <form action={register} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Name
            </label>
            <input
              id="userName"
              name="userName"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="your name..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              name="gender"
              defaultValue=""
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            >
              <option value="" disabled>
                Select your gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <Link
              href="#"
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Forgot password?
            </Link>
          </div>

          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors">
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?
          <Link
            href="/sign-in"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Sign In
          </Link>
        </div>
        <form action={GitHubLogin}>
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-fulltext-black rounded-md h-10 font-medium shadow-inputbg-gray-50 dark:bg-zinc-900 dark: shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <FaGithub className="h-4 w-4 text-neutral-800  dark:text-neutral-300" />
            <span className="text-neutral-700  dark:text-neutral-300 text-sm">
              Github
            </span>
          </button>
        </form>

        <form action={GoogleLogin}>
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-fulltext-black rounded-md h-10 font-medium shadow-inputbg-gray-50 dark:bg-zinc-900 dark: shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <FaGoogle className="h-4 w-4 text-neutral-800  dark:text-neutral-300" />
            <span className="text-neutral-700  dark:text-neutral-300 text-sm">
              Google
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
