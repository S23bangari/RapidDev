import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const CreateWorkspace = mutation({
  args: {
    message: v.any(),
    user: v.id("users"),
  },
  handler: async (ctx, args) => {
    try {
      const workspaceId = await ctx.db.insert("workspace", {
        message: args.message,
        user: args.user,
      });
      return workspaceId; // Return only the ID
    } catch (error) {
      console.error("Error creating workspace:", error);
      throw new Error("Failed to create workspace");
    }
  },
});

export const GetWorkspace = query({
  args: {
    workspaceId: v.id("workspace"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.get(args.workspaceId);
    return result;
  },
});

export const updateMessage = mutation({
  args: {
    workspaceId: v.id("workspace"),
    message: v.any(),
  },
  handler: async (ctx, args) => {
    // Debugging: Log the arguments
    console.log("Workspace ID:", args.workspaceId);
    console.log("Message:", args.message);

    // Check if the workspace exists
    const workspace = await ctx.db.get(args.workspaceId); 
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    try {
      // Update the workspace's message field
      const result = await ctx.db.patch(args.workspaceId, {
        message: args.message,
      });
      return result;
    } catch (error) {
      console.error("Error updating workspace:", error);
      throw new Error("Failed to update workspace");
    }
  },
});


export const UpdateFiles = mutation({
  args: {
    workspaceId: v.id("workspace"),
    files: v.any(),
  },
  handler: async (ctx, args) => {
    // Debugging: Log the arguments
    console.log("Workspace ID:", args.workspaceId);
    console.log("Message:", args.files);

    // Check if the workspace exists
    const workspace = await ctx.db.get(args.workspaceId); 
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    try {
      // Update the workspace's message field
      const result = await ctx.db.patch(args.workspaceId, {
        fileData: args.files,
      });
      return result;
    } catch (error) {
      console.error("Error updating workspace:", error);
      throw new Error("Failed to update workspace");
    }
  },
});

export const GetAllWorkspaces = query({
  args: {
    userId: v.id("users"),
  },
  handler:async (ctx, args) => {
    const result = await ctx.db.query("workspace")
    .filter(q=>q.eq(q.field('user'),args.userId))
    .collect();

    return result;
  }
})