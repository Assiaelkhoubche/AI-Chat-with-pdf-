"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { FilePlus2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { logout } from "@/action/user";
import { UserFetched } from "@/types/type";
import { useUser } from "@/app/_context/UserContext";

const Header = () => {
  const { user } = useUser();
  return (
    <div className="flex justify-between bg-white shadow-sm p-5 border-b fixed top-0 z-50 right-0 left-0 ">
      <Link href="/dashboard" className="text-2xl">
        Chat to <span className="text-indigo-600">PDF</span>
      </Link>
      <div className="flex items-center space-x-2">
        <Button asChild variant="link" className="hidden md:flex">
          <Link href="/dashboard/upgrade">Pricing</Link>
        </Button>

        <Button asChild variant="outline">
          <Link href="/dashboard">My Document</Link>
        </Button>

        <Button asChild variant="outline" className="border-indigo-600">
          <Link href="/dashboard/upgrade">
            <FilePlus2 className="text-indigo-600" />
          </Link>
        </Button>
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <img
                src={
                  user.image ||
                  "https://th.bing.com/th/id/OIP.7O4_GREtLbxqPdJCTmfatQHaHa?rs=1&pid=ImgDetMain"
                }
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild className="border-indigo-500">
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <form action={logout}>
                  <button type="submit">Logout</button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default Header;
