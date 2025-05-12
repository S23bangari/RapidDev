"use client";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState, useRef } from "react";
import { useConvex, useMutation } from "convex/react";
import { MessagesContext } from "@/context/MessagesContext";
import Colors from "@/data/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import Image from "next/image";
import { ArrowRight, Link } from "lucide-react";
import Lookup from "@/data/Lookup";
import Prompt from "@/data/Prompt";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useSidebar } from "../ui/sidebar";
import { PanelRightOpen } from "lucide-react";
import { toast } from "sonner"

export const countToken = (inputText) => {
  return inputText.trim().split(/\s+/).filter(word => word).length;
};

const ChatView = () => {
  const { id } = useParams();
  const convex = useConvex();
  const { userDetail,setUserDetail } = useContext(UserDetailContext);
  const { messages, setMessages } = useContext(MessagesContext);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const updateMessage = useMutation(api.workspace.updateMessage);
  const { toggleSidebar } = useSidebar();
  const [isSidebarOpenIcon, setIsSidebarOpenIcon] = useState(false);
  //const UpdateUserToken = useMutation(api.users.UpdateUserToken);

  const toggleSidebarIcon = () => {
    setIsSidebarOpenIcon((prev) => !prev);
  };

  useEffect(() => {
    if (id) {
      GetWorkSpaceData();
    }
  }, [id]);

  // Fetch workspace data
  const GetWorkSpaceData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await convex.query(api.workspace.GetWorkspace, {
        workspaceId: id,
      });
      console.log(result);
      setMessages(result?.message || []);
    } catch (error) {
      console.error("Error fetching workspace data:", error);
      setError("Failed to fetch workspace data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Trigger AI response when the last message is from the user
  useEffect(() => {
    if (messages.length > 0) {
      const role = messages[messages.length - 1].role;
      if (role === "user") {
        GetAiResponse();
      }
    }
  }, [messages]);

  // Generate AI response
  const GetAiResponse = async () => {
    setIsAiLoading(true);
    setError(null);
    try {
      const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
      const result = await axios.post("/api/ai-chat", {
        prompt: PROMPT,
      });
      const aiResponse = result.data.result;

      // Add AI response to messages
      const aiResp = {
        role: "ai",
        content: aiResponse,
      };
      setMessages((prevMessages) => [...prevMessages, aiResp]);


      // Update workspace with new messages
      await updateMessage({
        message: [...messages, aiResp],
        workspaceId: id,
      });

      // const token = Number(userDetail?.token) - Number(countToken(aiResponse));
      // //Update Token in UserDetail
      // await UpdateUserToken({
      //   userId: userDetail?.id,
      //   token: token,
      // });
      // setUserDetail((prev) => ({
      //   ...prev,  
      //   token: token,
      // }));

    } catch (error) {
      console.error("Error generating AI response:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Handle user input
  const onGenerate = async (input) => {
    if(userDetail.token < countToken(input)) {
      toast({
        title: "Insufficient Tokens",
        description: "Buy more tokens to continue chatting.",
      });
      return;
    }
    if (!input.trim()) {
      alert("Please enter a valid message.");
      return;
    }

    // Add user message to messages
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: input },
    ]);

    // Clear input
    setUserInput("");
  };

  return (
    <div>
      <div className="relative group">
        <PanelRightOpen
          size={28}
          onClick={toggleSidebar}
          onClickCapture={toggleSidebarIcon}
          className="ml-3 hover:bg-gray-800 rounded-sm p-1 cursor-pointer"
        />
        <span className="absolute text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {isSidebarOpenIcon ? "Close Sidebar" : "Open Sidebar"}
        </span>
      </div>

      <div className="flex flex-col h-screen p-4 rounded-lg">
        {/* Chat Messages Section */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto scrollbar-hide mb-4 rounded-lg"
        >
          {isLoading && <p className="text-gray-500">Loading messages...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {Array.isArray(messages) &&
            messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg mb-4 ${
                  msg.role === "user"
                    ? "self-start flex items-center gap-2"
                    : "self-end ml-auto"
                }`}
                style={{
                  backgroundColor: Colors.CHAT_BACKGROUND,
                }}
              >
                {/* User Message: Flex (Image + Text on the same line, Bigger Font) */}
                {msg.role === "user" && (
                  <>
                    {userDetail?.picture ? (
                      <Image
                        src={userDetail.picture}
                        width={35}
                        height={35}
                        className="rounded-full"
                        alt="User profile"
                      />
                    ) : (
                      <div className="w-[50px] h-[35px] rounded-full flex flex-shrink-0 items-center justify-center">
                        <Image
                          src="/Tyler.jpeg"
                          width={40}
                          height={10}
                          className="rounded-full"
                          alt="User profile"
                        />
                      </div>
                    )}
                    <ReactMarkdown
                      components={{
                        p: ({ node, ...props }) => (
                          <p className="text-base font-semibold" {...props} />
                        ), // Bigger font
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </>
                )}

                {/* AI Message: No Flex (Text only, Smaller Font) */}
                {msg.role === "ai" && (
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => (
                        <p className="text-sm text-gray-300" {...props} />
                      ), // Smaller font, gray color
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
            ))}

          {/* AI typing messages... */}
          {isAiLoading && (
            <div className="p-3 rounded-lg mb-2 max-w-[80%] self-start">
              <p className="text-lg text-gray-500">AI is typing...</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}

        <div
          className="p-5 border rounded-xl"
          style={{
            backgroundColor: Colors.BACKGROUND,
          }}
        >
          <div className="flex gap-2">
            <textarea
              placeholder={Lookup.INPUT_PLACEHOLDER}
              className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"
              value={userInput}
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
      </div>
    </div>
  );
};

export default ChatView;