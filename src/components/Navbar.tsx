"use client";

import React, {useState} from "react";
import {usePathname} from "next/navigation";
import Link from "next/link";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const isActiveLink = (path: string) => pathname === path ? "text-gray-900 font-semibold" : "text-gray-500";

    return (
        <nav
            className="flex flex-wrap items-center justify-between w-full px-4 py-5 tracking-wide bg-white shadow-md bg-opacity-90 md:py-4 md:px-8 lg:px-14">
            {/* Left nav */}
            <div className="flex items-center">
                <a href="#" className="text-3xl tracking-wide">
                    EVP Ops Portal
                </a>
            </div>

            {/* Right nav */}
            {/* Toggle button for mobile menu */}
            <div className="block text-gray-600 cursor-pointer lg:hidden">
                <button onClick={toggleMenu} className="w-6 h-6 text-lg">
                    {menuOpen ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-x"
                        >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    ) : (
                        <svg
                            viewBox="0 0 48 48"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect width="48" height="48" fill="white" fillOpacity="0.01"></rect>
                            <path
                                d="M7.94977 11.9498H39.9498"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                            <path
                                d="M7.94977 23.9498H39.9498"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                            <path
                                d="M7.94977 35.9498H39.9498"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile menu */}
            <div
                className={`relative w-full overflow-hidden transition-all duration-700 lg:hidden ${menuOpen ? "max-h-screen" : "max-h-0"}`}
            >
                <div className="flex flex-col my-3 space-y-2 text-lg text-gray-600">
                    <a href="/payout" className={`${isActiveLink('/payout')} hover:text-gray-900`}>Payout</a>
                    <a href="/evp" className={`${isActiveLink('/evp')} hover:text-gray-900`}>EVP Store Config</a>
                    <a href="/ttb" className={`${isActiveLink('/ttb')} hover:text-gray-900`}>TTB Config</a>
                </div>
            </div>

            {/* Desktop menu */}
            <div className="hidden w-full lg:flex lg:items-center lg:w-auto">
                <Link
                    href="/payout"
                    className={`whitespace-nowrap text-base font-medium hover:text-gray-900 ${isActiveLink('/payout')}`}>
                    Payout
                </Link>
                <Link
                    href="/"
                    className={`ml-8 whitespace-nowrap text-base font-medium hover:text-gray-900 ${isActiveLink('/')}`}>
                    EVP Store Config
                </Link>
                <Link
                    href="/ttb/config"
                    className={`ml-8 whitespace-nowrap text-base font-medium hover:text-gray-900 ${isActiveLink('/ttb/config')}`}>
                    TTB Config
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
