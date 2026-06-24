const express = require("express");
const {
  addTask,
  editTask,
  getTasks,
  deleteTask,
  markTaskStatus,
} = require("../controller/task.controller");
const authMiddleware = require("../authMiddleware");

const router = express.Router();

router.post("/task", authMiddleware, addTask);
router.put("/task/:id", authMiddleware, editTask);
router.get("/tasks", authMiddleware, getTasks);
router.delete("/:id", authMiddleware, deleteTask);
router.patch("/:id/status", authMiddleware, markTaskStatus);

module.exports = router;
