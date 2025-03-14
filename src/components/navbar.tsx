"use client"

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";


export function Navbar() {

    return (
        <header className="border-b">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-primary"
                        >
                            <path d="M12 2H2v10h10V2z" />
                            <path d="M22 12H12v10h10V12z" />
                            <path d="M12 12H2v10h10V12z" />
                            <path d="M22 2h-8v8h8V2z" />
                    </svg>
                    <span className="text-lg font-bold">TaskBoard</span>
                </div>
                <div>
                    <SignedOut>
                        <SignInButton>
                            <Button>Sign In</Button>
                        </SignInButton>&nbsp;&nbsp;
                        <SignUpButton>
                            <Button>Sign Up</Button>
                        </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
                
            </div>
        </header>
    )
}

