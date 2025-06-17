import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const idSchema = z.object({
  id: z.string(),
});

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["pending", "in_progress", "done"]).default("pending"),
});

const taskUpdateSchema = taskSchema.extend({
  id: z.string(),
});

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(taskSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.create({
        data: {
          ...input,
          userId: ctx.userId,
        },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.task.findMany({
      where: { userId: ctx.userId },
      orderBy: { id: "desc" },
    });
  }),

  update: protectedProcedure
    .input(taskUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const existingTask = await ctx.db.task.findUnique({
        where: { id: parseInt(input.id) },
      });

      if (!existingTask || existingTask.userId !== ctx.userId) {
        throw new Error("Not authorized to update this task");
      }

      return ctx.db.task.update({
        where: { id: parseInt(input.id) },
        data: {
          title: input.title,
          description: input.description,
          status: input.status,
        },
      });
    }),

  delete: protectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx, input }) => {
      const existingTask = await ctx.db.task.findUnique({
        where: { id: parseInt(input.id) },
      });

      if (!existingTask || existingTask.userId !== ctx.userId) {
        throw new Error("Not authorized to delete this task");
      }

      return ctx.db.task.delete({
        where: { id: parseInt(input.id) },
      });
    }), 
});
