const Task = require("../models/Task");

// CREATE TASK
exports.createTask = async (req, res) => {
	try {
		const { title, description, status } = req.body;
		const newTask = new Task({
			title,
			description,
			status,
			user: req.user.userId,
		});

		await newTask.save();
		res.status(201).json({ message: "Task created successfully", task: newTask });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

// GET ALL TASKS (USER SPECIFIC)
exports.getTasks = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 6;

		const skip = (page - 1) * limit;
		const totalTasks = await Task.countDocuments({ user: req.user.userId });

		const tasks = await Task.find({ user: req.user.userId })
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit);

		res.json({
			tasks,
			totalPages: Math.ceil(totalTasks / limit),
			currentPage: page
		});
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

// UPDATE TASK
exports.updateTask = async (req, res) => {
	try {
		const { id } = req.params;

		const updatedTask = await Task.findOneAndUpdate(
			{ _id: id, user: req.user.userId },
			req.body,
			{ new: true }
		);
		if (!updatedTask) {
			return res.status(404).json({ message: "Task not found" });
		}

		res.json({ message: "Task updated", task: updatedTask });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
	if (req.user.role !== "admin") {
		return res.status(403).json({ message: "Access denied: Admins only" });
	}
	try {
		const { id } = req.params;

		const deletedTask = await Task.findOneAndDelete({
			_id: id,
			user: req.user.userId,
		});

		if (!deletedTask) {
			return res.status(404).json({ message: "Task not found" });
		}

		res.json({ message: "Task deleted" });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};
