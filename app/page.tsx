import HomeClient from "@/components/shared/HomeClient";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import LandingPage from "@/components/session/LandingPage";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="container mx-auto">
      {!session ? <LandingPage /> : <HomeClient />}
    </div>
  );
}
