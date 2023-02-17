import { Prisma } from '@prisma/client';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '../trpc';

const defaultTodoSelect = Prisma.validator<Prisma.todo_listSelect>()({
    id: true,
    todo: true,
    success: true,
    createdAt: true,
    updatedAt: true
});

export const todoRouter = createTRPCRouter({
    createTodo: publicProcedure
        .input(z.object({ todo: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const todo = await ctx.prisma.todo_list.create({
                data: {
                    todo: input.todo,
                    success: false,
                }
            });

            return todo;
        }),

    todoList: publicProcedure
        .input(
            z.object({
                limit: z.number().min(5).max(10).nullish(),
                cursor: z.string().nullish(),
            }),
        )
        .query(async ({ input, ctx }) => {
            const limit = input.limit ?? 5;
            const { cursor } = input;

            const items = await ctx.prisma.todo_list.findMany({
                select: defaultTodoSelect,
                take: limit + 1,
                where: {},
                cursor: cursor ? {
                    id: cursor,
                } : undefined,
                orderBy: {
                    createdAt: 'desc'
                },
            });

            let nextCursor: typeof cursor | undefined = undefined;
            if (items.length > limit) {
                const nextItem = items.pop()!;
                nextCursor = nextItem.id;
            }

            return {
                items: items.reverse(),
                nextCursor,
            }
        }),

    updateStatusById: publicProcedure
        .input(z.object(
            {
                id: z.string().nullish(),
                status: z.boolean().nullish(),
            }
        ))
        .mutation(async ({ input, ctx }) => {
            const updateStatus = await ctx.prisma.todo_list.update({
                where: {
                    id: input.id as string
                },
                data: {
                    success: input.status as boolean
                }
            })

            return updateStatus;
        }),

    dropById: publicProcedure
        .input(z.object({ id: z.string().nullish() }))
        .mutation(async ({ input, ctx }) => {
            const deleteTodo = await ctx.prisma.todo_list.delete({
                where: {
                    id: input.id as string,
                }
            })

            return deleteTodo;
        })
});
