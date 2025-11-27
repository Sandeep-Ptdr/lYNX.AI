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

export function AppSidebar() {
  const { data: session } = useSession();

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
              {conversations?.map((item, index ) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild className="rounded-[6px]  ">
                    <div className="flex justify-between items-center">
                      <a className="w-full" href={`/chat/${item?._id}`}>
                        <span>{item.title}</span>
                      </a>
                      <button
                        tooltip="Delete"
                        className="cursor-pointer hidden group-hover/menu-item:inline-block transform hover:scale-110 transition-transform duration-200 ease-in-out"
                        onClick={() => handleDelete(item?._id)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </SidebarMenuButton>
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
