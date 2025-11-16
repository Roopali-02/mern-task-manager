const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// SIGNUP CONTROLLER
exports.signup = async (req, res) => {
	try {
		const { name, email, password, role } = req.body;

		if (!name || !email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}
		if (password.length < 6) {
			return res.status(400).json({ message: "Password must be at least 6 characters long" });
		}
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: 'User already exists' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new User({
			name,
			email,
			password: hashedPassword,
			role: role || 'user',
		});

		await newUser.save();
		res.status(201).json({ message: 'User registered successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
};

// LOGIN CONTROLLER
exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: 'Invalid email or password' });
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid email or password' });
		}
		const token = jwt.sign(
			{
				userId: user._id,
				role: user.role
			},
			process.env.JWT_SECRET,
			{ expiresIn: '1d' }
		);

		res.json({
			message: 'Login successful',
			token,
			user: {
				name: user.name,
				email: user.email,
				role: user.role,
			}
		});
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
};
