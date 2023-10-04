"use client";
import HomeClient from "@/components/shared/HomeClient";

import LandingPage from "@/components/session/LandingPage";
import { useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();

  return (
    <div className="container mx-auto">
      {!session ? <LandingPage /> : <HomeClient />}
    </div>
  );
}
