import type { Metadata } from "next";
import localFont from "next/font/local";
import React from "react";
import { ToastContainer } from "react-toastify";
import AmplifyInit from "@/components/AmplifyInit";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.min.css';
import '@aws-amplify/ui-react/styles.css';

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "EVP Ops Dashboard",
    description: "EVP Ops Dashboard",
};

export default function RootLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {children}
                <AmplifyInit />
                <ToastContainer />
            </body>
        </html>
    );
}
