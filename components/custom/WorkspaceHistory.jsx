"use client";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useConvex } from "convex/react";
import React, { useEffect, useContext, useState } from "react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useSidebar } from "../ui/sidebar";

const WorkspaceHistory = () => {
  const { userDetail } = useContext(UserDetailContext);
  const convex = useConvex();
  const [workspacelist, setWorkspacelist] = useState([]);
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    if (userDetail) {
      GetAllWorkspaces();
    }
  }, [userDetail]);

  const GetAllWorkspaces = async () => {
    
    try {
      const result = await convex.query(api.workspace.GetAllWorkspaces, {
        userId: userDetail._id,
      });
      setWorkspacelist(result);
      console.log(result);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    }
  };

  return (
    <div>
      <h2 className="font-medium text-lg">Your Chats</h2>
      <hr />
      <div className="mt-5 pl-2 pr-2 pb-2">
        {workspacelist &&
          workspacelist.map((workspace, index) => (
            <Link href={"/workspace/" + workspace?._id} key={index}>
              <h2
                onClick={toggleSidebar}
                className="mb-3 text-base text-gray-300 mt-1 font-light hover:text-white"
              >
                {workspace?.message?.[0]?.content || "No messages"}
              </h2>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default WorkspaceHistory;