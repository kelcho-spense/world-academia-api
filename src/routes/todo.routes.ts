// src/routes/todoRoutes.ts
import { Router } from 'express';
import { getTodos, createTodo, updateTodo, deleteTodo, getTodo } from '../controllers/todo.controller';
import validateReq from '../middleware/validateResource';
import { createTodoSchema } from '../schema/todo.schema';
import { authMiddleware } from "../middleware/auth.middleware";

const todoRouter: Router = Router();

todoRouter.get('/todos', getTodos);
todoRouter.post('/todos', authMiddleware("user"), validateReq(createTodoSchema), createTodo);
todoRouter.put('/todos/:id', updateTodo);
todoRouter.get('/todos/:id', getTodo);
todoRouter.delete('/todos/:id', deleteTodo);

export default todoRouter;
