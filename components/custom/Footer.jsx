"use client";
import React, { useContext } from 'react';
import { Settings, HelpCircle, CreditCard, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from "next/navigation";
import { UserDetailContext } from "@/context/UserDetailContext";

const Footer = () => {
  const router = useRouter();
  const { setUserDetail } = useContext(UserDetailContext);

  const handleLogout = () => {
    // Clear user details from context and localStorage
    setUserDetail(null);
    localStorage.removeItem("user");

    // Redirect to  page
    router
      .push("/")
      .then(() => window.location.reload());
  };

  const options = [
    {
      name: "Settings",
      icon: Settings,
      path: '/settings',
    },
    {
      name: "Help",
      icon: HelpCircle,
      path: '/help',
    },
    {
      name: "My Subscriptions",
      icon: CreditCard,
      path: '/pricing',
    },
    {
      name: "Sign Out",
      icon: LogOut,
      onClick: handleLogout,
    },
  ];

  const onOptionClick = (option) => {
    if (option.onClick) {
      option.onClick();
    } else if (option.path) {
      router.push(option.path);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center p-1 mb-8'>
      {options.map((option, index) => (
        <Button
          variant="ghost"
          onClick={() => onOptionClick(option)}
          key={index}
          className="flex items-center justify-start w-full"
        >
          <option.icon className="mr-2" />
          {option.name}
        </Button>
      ))}
    </div>
  );
};

export default Footer;