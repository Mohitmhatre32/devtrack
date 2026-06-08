import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";
import { resolveAppUser } from "@/lib/resolve-user";
import { fetchAchievementEstimates } from "@/lib/achievement-estimators";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken || !session.githubId || !session.githubLogin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await resolveAppUser(session.githubId, session.githubLogin);

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const estimates = await fetchAchievementEstimates(
    session.githubLogin,
    session.accessToken
  );

  return Response.json({ estimates });
}
