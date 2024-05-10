const Task = require("../models/task");

exports.createTask = async (req, res) => {
  const { userId, title, description, priority, dueDate } = req.body;
  try {
    const task = await Task.create({
      userId,
      title,
      description,
      priority,
      dueDate,
    });
    console.log("task on creation", task);
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getTasksByUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const tasks = await Task.findAll({ where: { userId } });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateTask = async (req, res) => {
  const taskId = req.params.taskId;
  const { title, description, priority, dueDate, completed } = req.body;
  try {
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    task.title = title;
    task.description = description;
    task.priority = priority;
    task.dueDate = dueDate;
    task.completed = completed;
    await task.save();
    res.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteTask = async (req, res) => {
  const taskId = req.params.taskId;
  try {
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    await task.destroy();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
