import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { helloWorld, generateVideo } from "@/inngest/functions";

// Configure the Inngest serve handler for the Next.js App Router.
// This endpoint tells Inngest about all the functions we created.
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        helloWorld,      // The simple 'Hello World' test
        generateVideo,   // The automated video generation pipeline
    ],
});
