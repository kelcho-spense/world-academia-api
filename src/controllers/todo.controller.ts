// src/controllers/todoController.ts
import { Request, Response } from 'express';
import Todo, { ITodo } from '../models/todo.model';
import { databaseResponseTimeHistogram } from "../utils/metrics";


export const getTodos = async (req: Request, res: Response): Promise<void> => {
  const metricsLabels = {
    operation: "getTodos",
  };
  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const todos = await Todo.find();
    timer({ ...metricsLabels, success: "true" });
    res.status(200).json(todos);
  } catch (error) {
    timer({ ...metricsLabels, success: "false" });
    res.status(500).json({ error: error });
  }
};

export const getTodo = async (req: Request, res: Response): Promise<void> => {
  const metricsLabels = {
    operation: "getTodo",
  };
  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    timer({ ...metricsLabels, success: "true" });
    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.status(200).json(todo);
  } catch (error) {
    timer({ ...metricsLabels, success: "false" });
    res.status(500).json({ error: error });
  }
};

export const createTodo = async (req: Request, res: Response): Promise<void> => {
  const metricsLabels = {
    operation: "createTodo",
  };
  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const { title, description } = req.body;
    const newTodo: ITodo = new Todo({
      title,
      description,
    });

    const savedTodo = await newTodo.save();
    timer({ ...metricsLabels, success: "true" });
    res.status(201).json(savedTodo);
  } catch (error) {
    timer({ ...metricsLabels, success: "false" });
    res.status(500).json({ error: error });
  }
};

export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  const metricsLabels = {
    operation: "updateTodo",
  };
  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, description, completed },
      { new: true }
    );

    if (!updatedTodo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }
    timer({ ...metricsLabels, success: "true" });
    res.status(200).json(updatedTodo);
  } catch (error) {
    timer({ ...metricsLabels, success: "false" });
    res.status(500).json({ error: error });
  }
};

export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
