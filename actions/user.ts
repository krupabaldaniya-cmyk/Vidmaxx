'use server'

import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

let hasLoggedDbUnreachable = false;

export async function syncUser() {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            console.warn("syncUser: User context missing", { userId, hasUser: !!user });
            return { error: "User not found" };
        }

        if (!supabaseAdmin) {
            console.error("syncUser: Supabase Admin client not initialized. Check SUPABASE_SERVICE_ROLE_KEY environment variable.");
            return { error: "Database configuration missing" };
        }

        // Check if user exists
        const { data: existingUser, error: fetchError } = await supabaseAdmin
            .from("users")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle();

        if (fetchError) {
            const fetchErrorSummary = {
                code: (fetchError as any)?.code,
                message: (fetchError as any)?.message,
                details: (fetchError as any)?.details,
                hint: (fetchError as any)?.hint,
            };

            const detailsStr = String(fetchErrorSummary.details || "");
            const messageStr = String(fetchErrorSummary.message || "");
            const isDbUnreachable =
                messageStr.includes("fetch failed") ||
                detailsStr.includes("ENOTFOUND") ||
                detailsStr.includes("EAI_AGAIN") ||
                detailsStr.includes("ECONNREFUSED") ||
                detailsStr.includes("ETIMEDOUT");

            if (isDbUnreachable) {
                if (!hasLoggedDbUnreachable) {
                    hasLoggedDbUnreachable = true;
                    console.warn(
                        "syncUser: Database unreachable; skipping user sync.",
                        JSON.stringify(fetchErrorSummary)
                    );
                }
                return {
                    skipped: true,
                    reason: "Database unreachable",
                };
            }

            console.error(
                "syncUser: Error fetching existing user:",
                JSON.stringify(fetchErrorSummary)
            );
            return {
                error: "Database error",
                ...fetchErrorSummary,
            };
        }

        if (!existingUser) {
            console.log(`syncUser: Creating new user record for ${userId}`);
            const { error: insertError } = await supabaseAdmin
                .from("users")
                .insert({
                    user_id: userId,
                    email: user.emailAddresses[0].emailAddress,
                    name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                });

            if (insertError) {
                console.error("syncUser: Error inserting user:", insertError);
                return { error: "Failed to sync user" };
            }
            console.log(`syncUser: Successfully created user record for ${userId}`);
        }
        return { success: true };
    } catch (error) {
        console.error("syncUser: Unexpected internal error:", error);
        return { error: "Internal error" };
    }
}
