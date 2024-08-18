import { z, object, string, boolean, date } from 'zod';

export const createTodoSchema = object({
  body: object({
    title: string({
      required_error: "Title is required",
    }),
    description: string({
      required_error: "Description is required",
    }),
    completed: boolean().optional(), // Optional because it has a default value in the model
    createdAt: date().optional(), // Optional because it has a default value in the model
  }),
});

