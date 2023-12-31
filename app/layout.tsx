import "./globals.css";

import { Inter } from "next/font/google";

import ModalsProvider from "@/components/providers/modals-provider";
import QueryProvider from "@/components/providers/query-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";

import type { Metadata } from "next";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mini DSC",
  description: "Mini DSC clone by Michał Miłek",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning>
        <body
          className={cn(
            inter.className,
            "bg-slate-100 dark:bg-gray-800 overflow-y-hidden"
          )}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            storageKey="customDiscordTheme"
            disableTransitionOnChange>
            <QueryProvider>
              <SocketProvider>
                <ModalsProvider />
                <Toaster />
                {children}
              </SocketProvider>
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
