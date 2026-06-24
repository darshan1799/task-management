const TaskModel = require("../models/taskModel");

const addTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const task = await TaskModel.create({
      userId: req.user.id,
      title,
      description,
      priority,
      dueDate,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const editTask = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, description, priority, dueDate, status } = req.body;

    const task = await TaskModel.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (status === "Completed") {
      const finalDescription =
        description !== undefined ? description : task.description;

      const finalDueDate = dueDate !== undefined ? dueDate : task.dueDate;

      if (!finalDueDate) {
        return res.status(400).json({
          success: false,
          message: "Task cannot be completed without a due date",
        });
      }

      if (!finalDescription || finalDescription.trim().length < 20) {
        return res.status(400).json({
          success: false,
          message: "Description must be at least 20 characters long",
        });
      }
    }

    const updatedTask = await TaskModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        priority,
        dueDate,
        status,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await TaskModel.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const markTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Pending", "Completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const task = await TaskModel.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (status === "Completed") {
      if (!task.dueDate) {
        return res.status(400).json({
          success: false,
          message: "Task cannot be completed without a due date",
        });
      }

      if (!task.description || task.description.trim().length < 20) {
        return res.status(400).json({
          success: false,
          message: "Description must be at least 20 characters long",
        });
      }
    }

    task.status = status;

    await task.save();

    return res.status(200).json({
      success: true,
      message: `Task marked as ${status}`,
      data: task,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  addTask,
  editTask,
  getTasks,
  deleteTask,
  markTaskStatus,
};
