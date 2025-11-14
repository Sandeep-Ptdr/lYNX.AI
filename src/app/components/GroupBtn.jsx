"use client"

import * as React from "react"
import {
  ArchiveIcon,
  ArrowLeftIcon,
  CalendarPlusIcon,
  ClockIcon,
  ListFilterPlusIcon,
  MailCheckIcon,
  MoreHorizontalIcon,
  PlusIcon,
  TagIcon,
  Trash2Icon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMode } from "@/context/modeContext"

export function ButtonGroupDemo() {
   
  const {mode,setMode} = useMode();
 
  return (
    <ButtonGroup className='rounded-2xl'>
       
      
      <ButtonGroup >
        
        <DropdownMenu >
          <DropdownMenuTrigger asChild className="rounded-full">
            <Button variant="outline" size="icon" aria-label="More Options">
              <PlusIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuGroup>
           Mode : {mode?.mode}
 
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem  onClick={() => setMode({mode:"friendly"})}>
                {/* <ClockIcon /> */}
                Friendly
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMode({mode:"programming"})}>
                {/* <CalendarPlusIcon /> */}
                Programmer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMode({mode:"emotional"})}>
                {/* <ListFilterPlusIcon /> */}
                Emotional
              </DropdownMenuItem>
              <DropdownMenuSub>
                {/* <DropdownMenuSubTrigger>
                  <TagIcon />
                  Label As...
                </DropdownMenuSubTrigger> */}
                {/* <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={label}
                    onValueChange={setLabel}
                  >
                    <DropdownMenuRadioItem value="personal">
                      Personal
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="work">
                      Work
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="other">
                      Other
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent> */}
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {/* <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">
                <Trash2Icon />
                Trash
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </ButtonGroup>
  )
}
