"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
const LogoutBtn = () => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);

      const toastId = toast.loading("Logging out...", {
         style: {
          background: "rgba(12, 18, 40, 0.6)", 
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderRadius: "12px",
          border: "1px solid rgba(0, 102, 255, 0.35)",
          boxShadow: "0 0 25px rgba(0, 102, 255, 0.20)",
          color: "#E3ECFF",  
          padding: "14px 18px",
        },
        iconTheme: {
          primary: "#3B82F6",
          secondary: "rgba(12,18,40,0.9)",
        },
      });

      await signOut({
        callbackUrl: "/login",
       
        
      });

      toast.success("Logged out successfully!", {
        id: toastId,
      });
    } catch (error) {
      toast.error(error.message, {
        style: {
          background: "#0B1120",
          color: "#fff",
          border: "1px solid #1E293B",
        },
      });
    }finally{
        setLoading(false);
    }
  };

  return (
    <Button disabled={loading} onClick={handleLogout} variant="outline">
      {loading ? "Logging out..." : "Logout"} <ArrowRight />
    </Button>
  );
};

export default LogoutBtn;
