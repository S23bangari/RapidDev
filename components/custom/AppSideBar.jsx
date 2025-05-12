import React, { useContext } from "react";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { MessageCircleCode } from "lucide-react";
import WorkspaceHistory from "./WorkspaceHistory";
import Footer from "./Footer";
import { UserDetailContext } from "@/context/UserDetailContext";
import Link from "next/link";
const AppSideBar = () => {
  const { userDetail } = useContext(UserDetailContext);
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-5">
          {/* <Image
            src={userDetail.picture}
            width={35}
            height={35}
            className="rounded-full"
            alt="User profile"
          /> */}
          
          <Image
            className="rounded-lg"
            src={"/Tyler.jpeg"}
            alt="logo"
            width={30}
            height={30}
          />
          <p className="text-base font-medium">
            {userDetail?.name || "Guest"} {/* Use user's name or fallback */}
          </p>
        </div>
        <Button className="mt-5">
          <MessageCircleCode />
          <Link href="http://localhost:3000">
          <p className="font-medium text-base">Start New</p>
          </Link>
        </Button>
      </SidebarHeader>
      <SidebarContent className="p-5">
        <SidebarGroup />
        <WorkspaceHistory />
        {/* <SidebarGroup /> */}
      </SidebarContent>
      <SidebarFooter>
        <Footer />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSideBar;
