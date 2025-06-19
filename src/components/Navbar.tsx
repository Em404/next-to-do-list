import React from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

function Navbar() {
  return (
    <div className="flex justify-between items-center container mx-auto max-w-5xl">
      <Link href={"/"}>
        <h1 className="font-semibold">Next To Do List</h1>
      </Link>
      <div>
        <SignedOut>
          <SignInButton>
            <span className="hover:cursor-pointer">Sing in</span>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton
            showName
            appearance={{
              elements: {
                userButtonBox: "text-white hover:cursor-pointer",
              },
            }}
          />
        </SignedIn>
      </div>
    </div>
  );
}

export default Navbar;
