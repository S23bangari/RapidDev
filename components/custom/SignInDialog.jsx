import React, { useContext } from "react";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Lookup from "@/data/Lookup";
import axios from "axios";
import { UserDetailContext } from "../../context/UserDetailContext";
import { useMutation } from "convex/react";
import uuid4 from "uuid4";
import { api } from "@/convex/_generated/api";
import { Button } from "../ui/button";
import { useGoogleLogin } from "@react-oauth/google";

// Dynamically import GoogleLogin with SSR disabled
const GoogleLogin = dynamic(() =>
  import("@react-oauth/google").then((mod) => mod.GoogleLogin),
  { ssr: false }
);

const SignInDialog = ({ openDialog, closeDialog }) => {
  const { setUserDetail } = useContext(UserDetailContext);
  const CreateUser = useMutation(api.users.CreateUser);
  
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      try {
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );
        console.log(userInfo);

        const user = userInfo.data;
        await CreateUser({
          name: user.name,
          email: user.email,
          picture: user.picture,
          uid: uuid4(),
        });

        if (typeof window !== undefined) {
          localStorage.setItem('user', JSON.stringify(user));
        }

        setUserDetail(user);
        closeDialog(false);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    },
    onError: errorResponse => console.log(errorResponse),
  });


  // const handleGoogleLoginSuccess = async (tokenResponse) => {
  //   try {
  //     const userInfo = await axios.get(
  //       "https://www.googleapis.com/oauth2/v3/userinfo",
  //       { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
  //     );

  //     const userData = {
  //       name: userInfo.data.name,
  //       email: userInfo.data.email,
  //       picture: userInfo.data.picture,
  //       uid: uuid4(),
  //     };

  //     await createUser(userData);

  //     if (typeof window !== "undefined") {
  //       localStorage.setItem("user", JSON.stringify(userData));
  //     }

  //     setUserDetail(userData);
  //     closeDialog(false);
  //   } catch (error) {
  //     console.error("Error fetching user info:", error);
  //   }
  // };

  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-xl">{Lookup.SIGNIN_HEADING}</DialogTitle>
          <DialogDescription>
            <span>{Lookup.SIGNIN_SUBHEADING}</span>
          </DialogDescription>
          <div className="flex flex-col justify-center items-center gap-3"> 
            {/* <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={(error) => console.error("Google login error:", error)}
            /> */}
            <Button className="mt-3 bg-blue-400"
              onClick={googleLogin}
            >Sign In With Google</Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SignInDialog;