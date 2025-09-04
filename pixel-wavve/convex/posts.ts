import { v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
// we need a uploader url for uploads in convex and expo has built in utilities for that
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    console.log("here in hanlder");
    console.log("=== Debug Info ===");
    console.log("Auth object:", ctx.auth);
    const identity = await ctx.auth.getUserIdentity();
    console.log(identity, "identity");
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
    const authCheckRes = await getAuthenticatedUser(ctx);
    if (!authCheckRes.success) {
      throw new Error("Unathorized");
    }
    const currntUser = authCheckRes.data;
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

export const getFeedsPosts = query({
  handler: async (ctx) => {
    try {
      const authCheckRes = await getAuthenticatedUser(ctx);
      if (!authCheckRes.success || !authCheckRes.data) {
        throw new Error("Unathorized");
      }
      const posts = await ctx.db.query("posts").order("desc").collect();
      if (posts.length === 0) {
        return [];
      }
      const userId = authCheckRes.data._id;
      // enhance posts with user
      const postsWithInfo = await Promise.all(
        posts.map(async (post) => {
          const author = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", post.userId))
            .first();
          const likedPostRes = await ctx.db
            .query("likes")
            .withIndex("by_post_and_user", (q) =>
              q.eq("postId", post._id).eq("userId", userId)
            )
            .first();
          const bookmarkedPostRes = await ctx.db
            .query("bookmarks")
            .withIndex("by_both", (q) =>
              q.eq("userId", userId).eq("postId", post._id)
            )
            .first();
          return {
            ...post,
            author,
            liked: !!likedPostRes,
            bookmarked: !!bookmarkedPostRes,
          };
        })
      );
      return { success: true, data: postsWithInfo };
    } catch (error) {
      console.error(error, "error in posts query");
      return { success: false, error };
    }
  },
});

export const getAuthenticatedUser = async (ctx: QueryCtx | MutationCtx) => {
  try {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user?._id) {
      throw new Error("Unauthorized");
    }
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error };
  }
};
