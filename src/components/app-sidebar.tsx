"use client"

import React, { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import {
  Bot,
  GalleryVerticalEnd,
  SquareTerminal,
} from "lucide-react"
import { getCurrentUser, GetCurrentUserOutput } from 'aws-amplify/auth';

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"
import { User } from "@/types/user";

interface NavItem {
  title: string;
  url: string;
  icon?: React.ComponentType;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

const getNavData = (currentPath: string): { navMain: NavItem[] } => ({
  navMain: [
    {
      title: "Platform",
      url: "#",
      icon: SquareTerminal,
      isActive: currentPath.startsWith('/payout'),
      items: [
        {
          title: "Payouts Calculator",
          url: "/payout",
        },
      ],
    },
    {
      title: "EDC Utilities",
      url: "#",
      icon: Bot,
      isActive: currentPath.startsWith('/edc'),
      items: [
        {
          title: "EVP Store Config",
          url: "/edc/store-config",
        },
        {
          title: "TTB Config",
          url: "/edc/ttb-config",
        }
      ],
    }
  ]
});

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [user, setUser] = useState<GetCurrentUserOutput | null>(null);
  const [userDetail, setUserDetail] = useState<User | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setUserDetail({
          name: currentUser.username,
          email: currentUser.signInDetails?.loginId,
          avatar: `https://ui-avatars.com/api/?name=${currentUser.username}&background=random`,
        });
      } catch (error) {
        console.error(error);
      }
    };

    if (!user) {
      fetchCurrentUser();
    }
  }, [user]);

  const navigationData = getNavData(pathname);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              EVP Portal
            </span>
            <span className="truncate text-xs">Operation Team</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userDetail} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}