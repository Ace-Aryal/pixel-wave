// we will verify weebhooks here so that we do can protect our db form attacks
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
const http = httpRouter();
http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error(
        "first time setup -- missing CLERK_WEBHOOK_SECRET env variable"
      );
      throw new Error("Missing CLERK_WEBHOOK_SECRET env variable");
    }
    //check headers
    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      console.error("Error occured -- no svix headers");
      return new Response("Error occured -- no svix headers", {
        status: 400,
      });
    }
    const payload = await request.json();
    const body = JSON.stringify(payload);
    const wh = new Webhook(webhookSecret);
    // verify webhook
    let evt: any;
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-signature": svix_signature,
        "svix-timestamp": svix_timestamp,
      }) as any;
    } catch (error) {
      console.error(error, "error verifying webhook");
      return new Response("Error occured", { status: 400 });
    }
    const eventType = evt.type;
    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } =
        evt.data;
      const email = email_addresses[0].email_address;
      const fullName = `${first_name || ""} ${last_name || ""}`.trim();

      try {
        await ctx.runMutation(api.user.createUser, {
          email,
          fullname: fullName,
          bio: "",
          image: image_url,
          clerkId: id,
          username: email.split("@")[0],
        });
      } catch (error) {
        console.error(error, "error creating user");
        return new Response("Error occured", { status: 400 });
      }
    }
    return new Response("Success", { status: 200 });
  }),
});

export default http;
