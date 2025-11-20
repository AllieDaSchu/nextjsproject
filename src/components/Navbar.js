"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import React from 'react';
export default function Navbar() {
    const {data: session, status} = useSession();

    return (
        <div className="fullNavContainer">
            <nav className="navbar">
                    <div className="links">
                        <Link href="/">Home</Link>
                        <Link href="/about">About</Link>
                        <Link href="/addProfile">Add Profile</Link>
                    </div>
                    <div className="account-section">
                        {status === "loading" ? (
                            <span>Loading...</span>
                        ) : session ? (
                            <>
                                <span className="userEmail">{session.user.email}</span>
                                <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="signOutBtn"
                                >
                                Sign Out
                                </button>
                            </>
                        ) : (
                        <Link href="/auth/signin" className="signInLink">
                            Sign In
                        </Link>
                        )}
                    </div>
            </nav>
        </div>
    )
}