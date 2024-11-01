"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "../ui/navigation-menu";
import Link from "next/link";


export function Topbar() {
    const { isSignedIn } = useAuth();
    return (
        <div>
            {isSignedIn ? (
                <UserButton afterSignOutUrl="/sign-in" />
            ) : (
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Link href="/sign-in" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Sign In
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            )}
        </div>
    )
}
