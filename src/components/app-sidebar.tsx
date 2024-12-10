"use client"

import React, { useEffect, useState } from "react"
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

const data = {
  navMain: [
    {
      title: "Platform",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
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
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

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
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userDetail} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
