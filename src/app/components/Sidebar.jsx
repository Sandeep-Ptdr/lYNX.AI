"use client";

import { useSession } from "next-auth/react";
import { User2, ChevronUp, Trash2, Plus, Edit } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import LogoutBtn from "./LogoutBtn";
import { useChatBot } from "@/hooks/useChat";
import { usePathname, useRouter } from "next/navigation";

import {
  ArchiveIcon,
  ArrowLeftIcon,
  CalendarPlusIcon,
  ClockIcon,
  ListFilterPlusIcon,
  MailCheckIcon,
  MoreHorizontalIcon,
  TagIcon,
  Trash2Icon,
} from "lucide-react";

// import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  // DropdownMenu,
  // DropdownMenuContent,
  DropdownMenuGroup,
  // DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  // DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";

export function AppSidebar() {
  const { data: session } = useSession();
  const [label, setLabel] = React.useState("personal");
  const username = session?.user?.name || "User";

  const {
    conversations,
    errorMessages,
    convLoading,
    refreshConversations,
    deleteConversation,
  } = useChatBot();

  const loading = convLoading || errorMessages.length > 0;
  const pathname = usePathname();
  const router = useRouter();

  // console.log("cpnverattins", conversations);

  const handleDelete = async (conversationId) => {
    const deleted = await deleteConversation(conversationId);
    if (!deleted) return;

    refreshConversations();

    if (pathname.includes(conversationId)) {
      router.push("/chat/new");
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="mt-4">
            {/* LOGO LEFT ALIGNED */}
            <div
              className="flex items-center gap-3 mb-6 pl-2 cursor-pointer"
              onClick={() => router.push("/chat/new")}
            >
              {/* <img
                src="/logo.png"
                alt="LYNX Logo"
                className="h-10 w-10 object-contain"
              /> */}
              <span className="font-bold text-xl tracking-wide">LYNX</span>
            </div>

            <Button
              onClick={() => router.push("/chat/new")}
              className="rounded-[4px] cursor-pointer"
              variant="ghost"
            >
              <Edit /> New Chat
            </Button>
            <SidebarMenu className="mt-4">
              <SidebarGroupLabel className="text-lg ">Chats</SidebarGroupLabel>
              {conversations?.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <div className="px-2 py-1 rounded-[4px] hover:bg-accent hover:text-accent-foreground transition flex justify-between items-center">
                    <a href={`/chat/${item?._id}`} className="w-full">
                      {item.title}
                    </a>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          className="bg-transparent hover:bg-transparent cursor-pointer"
                          variant="ghost"
                          size="icon"
                        >
                          <MoreHorizontalIcon />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-40 rounded">
                        <DropdownMenuItem
                          className="text-red-600 hover:text-red-700 cursor-pointer rounded"
                          onClick={() => handleDelete(item?._id)}
                        >
                          <Trash2Icon className="mr-2 h-4 w-4" />
                          Delete Chat
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/*USER PROFILE DROPDOWN*/}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 />
                  {username}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width] rounded-[6px]"
              >
                <DropdownMenuItem>
                  <LogoutBtn />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
