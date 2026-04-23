import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { sql, initTables } from "@/lib/db";
import LandingPage from "@/components/landing/LandingPage";

export default async function Page() {
  const { userId } = await auth();

  if (userId) {
    await initTables();
    const rows = await sql`SELECT 1 FROM user_authors WHERE user_id = ${userId} LIMIT 1`;
    redirect(rows.length > 0 ? "/dashboard" : "/onboarding");
  }

  return <LandingPage />;
}
