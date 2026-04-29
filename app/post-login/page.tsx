import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { initTables, upsertUser, isUserOnboarded } from "@/lib/db";
import PostLoginRedirect from "./PostLoginRedirect";

export default async function PostLoginPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  await initTables();
  await upsertUser(userId);
  const onboarded = await isUserOnboarded(userId);

  return <PostLoginRedirect to={onboarded ? "/dashboard" : "/onboarding"} />;
}
