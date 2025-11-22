"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApi } from "@/hooks/useFetch";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const SignUp = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const toastId = "GLOBAL_TOAST_ID";

  const router = useRouter();

  const { post, loading, error } = useApi();

  const onChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  useEffect(() => {
    if (loading) {
      toast.loading("Loading...", {
        id: toastId,
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
    }
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      toast.error("Password doesn't match", {
        id: toastId,
      });
      return;
    }

    const { data, error, success } = await post("/api/auth/register", user);
    // console.log(loading, "loa");

    if (!success) {
      toast.error(error || "Something went wrong", {
        id: toastId,
      });
      return;
    }

    toast.success("Registered Successfully!", {
      id: toastId,
    });

    if (success) {
      router.push("/login");
    }
    // console.log("user", data);
  };

  return (
    <>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
        <Card className="w-md max-w-[500px] max-h-md h-max rounded">
          <CardHeader>
            <CardTitle>Signup to your account</CardTitle>
            <CardDescription>
              Enter your details below to Signup.
            </CardDescription>
            <CardAction>
              <Button variant="link">
                <Link href="/login">Log in</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Full Name</Label>
                  <Input
                    className="rounded-[6px]"
                    onChange={onChange}
                    name="name"
                    value={user.name}
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    onChange={onChange}
                    name="email"
                    value={user.email}
                    className="rounded-[6px]"
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    onChange={onChange}
                    name="password"
                    value={user.password}
                    id="password"
                    type="password"
                    required
                    className="rounded-[6px]"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Confirm Password</Label>
                  <Input
                    onChange={onChange}
                    name="confirmPassword"
                    id="Cpassword"
                    value={user.confirmPassword}
                    type="password"
                    required
                    className="rounded-[6px]"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-[6px] cursor-pointer mt-4"
              >
                Sign Up
              </Button>
            </form>
          </CardContent>
          {/* <Button variant="outline" className="w-full">
            Login with Google
          </Button> */}
        </Card>
      </div>
    </>
  );
};

export default SignUp;
