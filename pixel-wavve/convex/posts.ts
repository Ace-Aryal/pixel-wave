import { v } from "convex/values";
import { mutation } from "./_generated/server";
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      console.error("Unauthorized");
      throw new Error("Unauthorized");
    }
    const uploadUrl = await ctx.storage.generateUploadUrl();
    console.log("upload url", uploadUrl);
    return uploadUrl;
  },
});

export const createPost = mutation({
  args: {
    caption: v.optional(v.string()),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const currntUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    //
    if (!currntUser) {
      throw new Error("User not found");
    }
    const imageUrl = await ctx.storage.getUrl(args.storageId);
    if (!imageUrl) {
      throw new Error("No image to upload");
    }
    //create post
    const postId = await ctx.db.insert("posts", {
      userId: currntUser._id,
      imageUrl,
      comments: 0,
      likes: 0,
      storageId: args.storageId,
      caption: args.caption ? args.caption : "",
    });
    // increment user post count by 1
    await ctx.db.patch(currntUser._id, {
      posts: currntUser.posts + 1,
    });
    return postId;
  },
});
