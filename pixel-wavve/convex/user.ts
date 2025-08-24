// this is like server actions in next.js , router in tRPC and action, mutation, and query in convex (action to talk to third party apis)
// we can use this to call a function on the server and then return the result to the client

import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createUser = mutation({
  args: {
    username: v.string(),
    fullname: v.string(),
    image: v.string(),
    bio: v.optional(v.string()),
    email: v.string(),
    clerkId: v.string(),
  },
  //   ctx to talk to db and auth and args are just args
  handler: async (ctx, args) => {
    const { clerkId, email, fullname, image, username } = args;
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();
    if (existingUser?._id) {
      return;
    }
    await ctx.db.insert("users", {
      clerkId,
      username,
      email,
      followers: 0,
      following: 0,
      fullname,
      image,
      posts: 0,
    });
  },
});
