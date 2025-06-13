import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
// import { prisma } from '../../db';


const idSchema = z.object({
  id: z.string()
})

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'done']).default('pending'),
})

const taskUpdateSchema = taskSchema.extend({
  id: z.string(),
});

export const taskRouter = createTRPCRouter({
  create: publicProcedure
    .input(taskSchema)
    .mutation(async ({ ctx, input }) => {
      return  ctx.db.task.create({
        data: input,
      });
    }),

  getAll: publicProcedure
    .query(async ({ ctx }) => {
      const task = await ctx.db.task.findMany({
        orderBy: { id: 'desc'}
      });
      return task;
    }),

  update: publicProcedure
    .input(taskUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.task.update({
        where: { id: parseInt(input.id) },
        data: {
          title: input.title,
          description: input.description,
          status: input.status,
        },
      });
    }),

  delete: publicProcedure
    .input(idSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.task.delete({
        where: { id: parseInt(input.id) },
      });
    }),

});
