import Lookup from "@/data/Lookup";
import React, { useContext, useState } from "react";
import { Button } from "../ui/button";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner"
const PricingModel = () => {
  const { userDetail, setUserDetail } = useContext(UserDetailContext); 
  const UpdateUserToken = useMutation(api.users.UpdateUserToken);
  const [selectedOption, setSelectedOption] = useState(null); // Initialize as null

  const onPaymentSuccess = async () => {
    if (!selectedOption) {
      alert("No pricing option selected.");
      return;
    }

    try {
      const token = userDetail?.token + Number(selectedOption?.value);
      console.log("Updated Tokens:", token);

      await UpdateUserToken({
        token: token,
        userId: userDetail?._id,
      });

      setUserDetail({ ...userDetail, token: token }); // Update local state
      toast("Payment Successfull", {
        description: "Payment was successfull. Tokens updated.",
      });
    } catch (error) {
      console.error("Error updating tokens:", error);
      alert("Error updating tokens.");
    }
  };

  return (
    <div className="mt-10 w-2/3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {Lookup.PRICING_OPTIONS.map((pricing, index) => (
        <div
          key={index}
          className={`border p-3 flex flex-col items-center rounded-xl gap-3 pb-5 `}
          onClick={() => setSelectedOption(pricing)} // Set selected option on click
        >
          <h2 className="font-bold text-2xl">{pricing.name}</h2>
          <h2 className="font-medium text-lg">{pricing.tokens} Tokens</h2>
          <p className="text-gray-400">{pricing.desc}</p>

          <h2 className="font-bold text-4xl text-center mt-6">
            ${pricing.price}
          </h2>

          {selectedOption?.name === pricing.name && (
            <PayPalButtons
              style={{ layout: "horizontal" }}
              onApprove={onPaymentSuccess}
              onCancel={() =>toast("Payment Failed", {
                description: "Payment was cancelled by the user.",
              })}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: pricing.price,
                        currency_code: "USD",
                      },
                    },
                  ],
                });
              }}
            />
          )}
        </div>
      ))}

    </div>
  );
};

export default PricingModel;