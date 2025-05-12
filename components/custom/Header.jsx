"use client";
import React, { useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import Colors from "../../data/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import { LogOut } from 'lucide-react';
import SignInDialog from "./SignInDialog";

const Header = () => {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [openDialog, setOpenDialog] = useState(false);

  const handleLogout = () => {
    // Clear user details from context and localStorage
    setUserDetail(null);
    localStorage.removeItem("user");
  };

  const handleSignInClick = () => {
    setOpenDialog(true);
  };

  return (
    <div className="p-4 flex justify-between items-center">
      <Link href="http://localhost:3000">
        <Image src="/vercel.svg" alt="Logo" width={40} height={40} />
      </Link>
      {!userDetail?.name && ( // Conditionally render buttons based on userDetail
        <div className="flex gap-5">
          <Button variant="ghost" onClick={handleSignInClick}>Sign In</Button>
          <Button
            className="text-white"
            style={{
              backgroundColor: Colors.BLUE,
            }}
          >
            Get Started
          </Button>
        </div>
      )}
      {userDetail?.name && ( // Conditionally render user profile and logout button
        <div className="relative group">
          <Image
            src={userDetail.picture}
            width={50}
            height={50}
            className="rounded-lg cursor-pointer"
            alt="User profile"
          />
          <Button
            onClick={handleLogout}
            className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-gray-700 text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <LogOut /> 
            <p className="text-sm">Logout</p>
          </Button>
        </div>
      )}
      <SignInDialog
        openDialog={openDialog}
        closeDialog={() => setOpenDialog(false)}
      />
    </div>
  );
};

export default Header;