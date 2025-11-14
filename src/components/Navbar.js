import React from 'react';
import Link from 'next/link';

const Navbar = () => {
    return (
        <div className="fullNavContainer">
            <nav className="navbar">
                    <div className="links">
                        <Link href="/">Home</Link>
                        <Link href="/about">About</Link>
                        <Link href="/addProfile">Add Profile</Link>
                    </div>
            </nav>
        </div>
    )

}

export default Navbar;