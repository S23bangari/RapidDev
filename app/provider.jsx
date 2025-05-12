"use client";
import React, { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Header from "@/components/custom/Header";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSideBar from "@/components/custom/AppSideBar";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const Provider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [userDetail, setUserDetail] = useState(null); // Initialize as null
  const convex = useConvex();

  useEffect(() => {
    isAuthenticated();
  }, []);

  const isAuthenticated = async () => {
    try {
      if (typeof window !== "undefined") {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.email) {
          // Fetch from Database
          const result = await convex.query(api.users.GetUser, { email: user.email });
          if (result) {
            setUserDetail(result); // Update userDetail state
            console.log("User details fetched:", result);
          } else {
            console.error("User not found in the database.");
          }
        } else {
          console.log("No user found in localStorage.");
        }
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  return (
    <div>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY}>
      <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}>     
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
          <MessagesContext.Provider value={{ messages, setMessages }}>
            <NextThemesProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <Header />
              <SidebarProvider defaultOpen={false}>
                <AppSideBar />
                {children} {/* Ensure children are properly wrapped */}
              </SidebarProvider>
            </NextThemesProvider>
          </MessagesContext.Provider>
        </UserDetailContext.Provider>
        </PayPalScriptProvider>
      </GoogleOAuthProvider>
    </div>
  );
};

export default Provider;