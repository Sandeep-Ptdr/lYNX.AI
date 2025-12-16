import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ModeProvider } from "@/context/modeContext";
 
import Providers from "./providers/provider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LYNX-AI Assistant",
  description: "Created & ❤️ by Developers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ModeProvider>{children}</ModeProvider>
          <Toaster/>
        </Providers>
      </body>
    </html>
  );
}
