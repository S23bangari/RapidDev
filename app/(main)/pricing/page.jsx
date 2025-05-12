"use client";
import { UserDetailContext } from "@/context/UserDetailContext";
import Colors from "@/data/Colors";
import Lookup from "@/data/Lookup";
import React, { useContext } from "react";
import PricingModel from "@/components/custom/PricingModel";
const Pricing = () => {
  const { userDetail } = useContext(UserDetailContext);
  console.log(userDetail?.email);
  console.log(userDetail?.token);
  const token = (userDetail?.token)/1000;

  return (
    <div className="mt-10 flex flex-col items-center">
      <h2 className="font-bold text-5xl">Pricing</h2>
      <p className="text-gray-400 max-w-xl text-center mt-4">
        {Lookup.PRICING_DESC}
      </p>

      <div
        className="flex w-2/3 justify-between items-center p-5 border rounded-xl mt-5"
        style={{
          background: Colors.BACKGROUND,
        }}
      >
        <h2 className="text-lg ">
          <span className="font-bold">{token}k Token Left</span>
        </h2>
        <div className="">
          <h2>Need more tokes ?</h2>
          <p>Upgrade your plan below</p>
        </div>
      </div>
      <PricingModel />
    </div>
  );
};

export default Pricing;
