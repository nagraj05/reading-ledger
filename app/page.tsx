import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { initTables, upsertUser, isUserOnboarded } from "@/lib/db";
import LandingPage from "@/components/landing/LandingPage";

export default async function Page() {
  const { userId } = await auth();

  if (userId) {
    await initTables();
    await upsertUser(userId);
    const onboarded = await isUserOnboarded(userId);
    redirect(onboarded ? "/dashboard" : "/onboarding");
  }

  return <LandingPage />;
}
