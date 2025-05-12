"use client";
import Lookup from "@/data/Lookup";
import React, { useState, useContext } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "lucide-react";
import Colors from "../../data/Colors";
import SignInDialog from "./SignInDialog";
import { MessagesContext } from "../../context/MessagesContext";
import { UserDetailContext } from "../../context/UserDetailContext";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { TypewriterEffect } from "../ui/typewriter-effect";

const Hero = () => {
  const [userInput, setUserInput] = useState("");
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [openDialog, setOpenDialog] = useState(false);
  const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
  const router = useRouter();

  
  const onGenerate = async (input) => {
    if (!userDetail?.name) {
      setOpenDialog(true);
      return;
    }
  
    setMessages({
      role: "user",
      content: input,
    });
  
    try {
      const workspaceId = await CreateWorkspace({
        user: userDetail._id,
        message: [
          {
            role: "user",
            content: input,
          },
        ],
      });
      console.log("Workspace ID:", workspaceId); // Log the ID to verify
      router.push("/workspace/" + workspaceId); // Use the correct ID
    } catch (error) {
      console.error("Error creating workspace:", error);
      alert("Failed to create workspace. Please try again.");
    }
  };
  const words = [
    {
      text: "Build ",
    },
    {
      text: "awesome",
    },
    {
      text: "apps",
    },
    {
      text: "with",
    },
    {
      text: "Rapid.Dev",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  return (
    <div className="flex flex-col items-center mt-56 xl:mt-40 gap-3">
      <h2 className="font-bold text-xl"> <TypewriterEffect words={words} /></h2>
      <p className="text-gray-400 font-medium text-lg">{Lookup.HERO_DESC}</p>
      <div
        className="p-5 border rounded-xl max-w-xl w-full mt-3"
        style={{
          backgroundColor: Colors.BACKGROUND,
        }}
      >
        <div className="flex gap-2">
          <textarea
            placeholder={Lookup.INPUT_PLACEHOLDER}
            className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"
            onChange={(e) => setUserInput(e.target.value)}
          />
          {userInput && (
            <ArrowRight
              onClick={() => onGenerate(userInput)}
              className="bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer"
            />
          )}
        </div>
        <div>
          <Link className="h-5 w-5" /> 
        </div>
      </div>
      <div className="flex flex-wrap mt-5 max-w-2xl items-center justify-center gap-3">
        {Lookup?.SUGGSTIONS.map((suggestion, index) => (
          <h2
            onClick={() => setUserInput(suggestion)}
            key={index}
            className="p-2 px-2 border rounded-full text-sm text-gray-400 hover:text-white cursor-pointer"
          >
            {suggestion}
          </h2>
        ))}
      </div>
      <SignInDialog
        openDialog={openDialog}
        closeDialog={() => setOpenDialog(false)}
      />
    </div>
  );
};

export default Hero;
  