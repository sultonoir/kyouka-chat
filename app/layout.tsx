import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ProvidersTRPC from "@/lib/ProvidersTRPC";
import { getServerSession } from "next-auth";
import SessionProvider from "@/lib/SesionProviders";
import { Toaster } from "@/components/ui/toaster";
import { authOptions } from "./api/auth/[...nextauth]/route";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KyOuka chat",
  description: "chat for everyone",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html
      lang="en"
      className="dark"
    >
      <body className={inter.className}>
        <SessionProvider session={session}>
          <ProvidersTRPC>
            {children}
            <Toaster />
          </ProvidersTRPC>
        </SessionProvider>
      </body>
    </html>
  );
}
