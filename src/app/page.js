"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "@/app/glitch.css"; // We will create this CSS file

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/chat/new");
    }, 2000); // 2seconds redirect

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen max-h-screen bg-black">
      <h1 className="glitch text-6xl sm:text-8xl font-bold text-white" data-text="LYNX">
        LYNX
      </h1>
    </div>
  );
}
