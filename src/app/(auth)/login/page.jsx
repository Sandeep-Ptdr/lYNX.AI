"use client";
import { signIn, useSession } from "next-auth/react";
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
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Loading...", {
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

    setLoading(true);
    const res = await signIn("credentials", { redirect: false,callbackUrl: "/", ...user });
    setLoading(false);

    if (res?.error) {
      toast.error(res.error, {
        id: toastId,
        style: {
          background: "rgba(12, 18, 40, 0.6)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderRadius: "12px",
          border: "1px solid rgba(255, 0, 0, 0.35)",
          boxShadow: "0 0 25px rgba(255, 0, 0, 0.45)", // RED SHADOW
          color: "#E3ECFF",
          padding: "14px 18px",
        },
        iconTheme: {
          primary: "#EF4444", // red icon
          secondary: "rgba(12,18,40,0.9)",
        },
      });
      return;
    }
    if (res.ok) {
      toast.success("Login successful", {
        id: toastId,
      });

     router.replace("/chat/new");
    }

    // console.log('user credentials',res)
  };

  return (
    <>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-auto p-6 md:p-0">
        <Card className="w-auto md:w-md md:max-w-[500px]  max-h-md h-max rounded">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
            <CardAction>
              <Button variant="link" asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
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
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    onChange={onChange}
                    name="password"
                    value={user.password}
                    type="password"
                    required
                    className="rounded-[6px]"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-[6px] cursor-pointer mt-6"
              >
                Login
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

export default Login;
