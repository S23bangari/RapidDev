"use client";
import React, { useEffect, useContext } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from "@/data/Lookup";
import axios from "axios";
import Prompt from "@/data/Prompt";
import { MessagesContext } from "@/context/MessagesContext";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Loader, Loader2Icon } from "lucide-react";
//import { countToken } from "./ChatView";
import { UserDetailContext } from "@/context/UserDetailContext";
//import { UpdateUserToken } from "@/convex/users";

const CodeView = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = React.useState("code");
  const [files, setFiles] = React.useState(Lookup?.DEFAULT_FILE);
  const {messages, setMessages} = useContext(MessagesContext);
  const UpdateFiles = useMutation(api.workspace.UpdateFiles);
  const convex = useConvex();
  const [loding, setLoading] = React.useState(false);
  const { userDetail,setUserDetail } = useContext(UserDetailContext);
  //const UpdateUserToken = useMutation(api.users.UpdateUserToken);

  useEffect(() => {
    id&&GetFiles();
  },[id])

  const GetFiles = async() => {
    setLoading(true);
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceId:id
    });
    console.log(result);
    const mergedFiles = {...Lookup.DEFAULT_FILE,...result?.fileData};
    setFiles(mergedFiles);
    setLoading(false);
  }

  useEffect(() => {
    GenerateAiCode();
  }, [messages]);
  
  const GenerateAiCode = async() => {
    setLoading(true);
    const PROMPT = JSON.stringify(messages)+" "+Prompt.CODE_GEN_PROMPT; 
    const result = await axios.post("/api/gen-ai-code", {
      prompt:PROMPT
    });
    console.log(result.data);
    const aiResp = result.data;
    
    const mergedFiles = {...Lookup.DEFAULT_FILE,...aiResp.files};
    setFiles(mergedFiles);
    await UpdateFiles({
      workspaceId:id,
      files:aiResp?.files
    });
    
    // const token = Number(userDetail?.token) - Number(countToken(JSON.stringify(aiResp)));
    // await UpdateUserToken({
    //   userId:userDetail?.id,
    //   token:token
    // });
    setLoading(false);

  }
  return (
    <div className="p-4 relative">
      <div className="bg-[#181818] w-full p-2 border">
        <div className="flex items-center flex-wrap shrink-0 bg-black p-1 justify-center w-[140px] gap-3 rounded-full">
          <h2
            onClick={() => setActiveTab("code")}
            className={`text-sm cursor-pointer 
              ${
                activeTab == "code" &&
                "text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full"
              }`}
          >
            Code
          </h2>
          <h2
          onClick={() => setActiveTab("preview")}
            className={`text-sm cursor-pointer 
              ${
                activeTab == "preview" &&
                "text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full"
              }`}
          >
            Preview
          </h2>
        </div>
      </div>
      <SandpackProvider 
      files={files}
      template="react" theme={"dark"}
      customSetup={{
        dependencies:{
          ...Lookup.DEPENDANCY
        }
      }}
      options={{
        externalResources:['https://cdn.tailwindcss.com']
      }}
      >
        <SandpackLayout>
          {activeTab==='code'?<>
          <SandpackFileExplorer style={{height: "80vh"}}/>
          <SandpackCodeEditor style={{height: "80vh"}}/>
          </>:
          <>
          <SandpackPreview style={{height: "80vh"}} showNavigator={true}/>
          </>}
        </SandpackLayout>
      </SandpackProvider>
    {loding &&  <div className="p-10 bg-gray-900 opacity-80 absolute top-0 rounded-xl w-full h-full flex flex-col items-center justify-center z-50" style={{display:loding?'flex':'none'}}>
        <Loader2Icon className="animate-spin h-10 w-10 text-white"/>
          <h2 className="text-white">Generating your files...</h2>
      </div>}
    </div>
  );
};

export default CodeView;
