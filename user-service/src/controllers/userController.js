const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const logActivity = require("../utils/logActivity");
const { v4: uuidv4 } = require("uuid");

// REGISTER USER
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let { role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ 
                message: "Please enter all fields" 
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ 
                message: "Please enter a valid email" 
            });
        }

        if (!role) role = "nonActive";

        // Role Limits
        if (role === "administrator") {
            const adminCount = await User.countDocuments({ role: "administrator" });
            if (adminCount >= 5) {
                return res.status(403).json({ 
                    message: "Maximum number of administrators reached" 
                });
            }
        }

        if (role === "operator") {
            const operatorCount = await User.countDocuments({ role: "operator" });
            if (operatorCount >= 15) {
                return res.status(403).json({ 
                    message: "Maximum number of operators reached" 
                });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userId = "U-" + uuidv4().slice(0, 8);

        const user = await User.create({
            userId,
            username,
            email,
            password: hashedPassword,
            createdBy: req.user?.username || "system",
            role
        });

        await logActivity(
            "REGISTER_USER",
            `User ${user.username} registered successfully`,
            req.user
        );

        res.json({
            message: "User registered successfully",
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            message: "Internal server error" 
        });
    }
}

// LOGIN USER
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ 
                message: "Please enter all fields" 
            });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ 
                message: "User not found" 
            });
        }

        if (user.role === "nonActive") {
            return res.status(403).json({ 
                message: "User is not active" 
            });
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return res.status(401).json({ 
                message: "Invalid credentials" 
            });
        }

        const token = jwt.sign(
            {
                id:user._id,
                role:user.role,
                username:user.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        await logActivity(
            "LOGIN_USER",
            `User ${user.username} logged in successfully`,
            {
                id:user._id,
                role:user.role,
                username:user.username
            }
        );

        res.json({
            message: "User logged in successfully",
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            message: "Internal server error" 
        });
    }
}

// GET ALL USERS
exports.getUser = async (req, res) => {
    try{
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            message: "Internal server error" 
        });
    }
}

// UPDATE ALL USERS
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, role } = req.body;

        const user = await User.findByIdAndUpdate(id, {
            username,
            email,
            role,
            updatedBy: req.user?.username || "system"
        }, {
            new: true
        });

        await logActivity(
            "UPDATE_USER",
            `User ${user.username} updated successfully`,
            req.user
        );

        res.json({
            message: "User updated successfully",
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            message: "Internal server error"
        })
    }
}

// DELETE ALL USERS
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);

        await logActivity(
            "DELETE_USER",
            `User ${user.username} deleted successfully`,
            req.user
        );

        res.json({
            message: "User deleted successfully",
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            message: "Internal server error" 
        });
    }
}

// DEACTIVATE USER
exports.deactivateUser = async (req, res) => {
    try {
        const {id} = req.params
        const {role} = req.body

        const user = await User.findByIdAndUpdate(
            id,
            {
                role,
                updatedBy: req.user?.username,
                updatedAt: Date.now(),
            },
            {new: true}
        )

        await logActivity(
            "DEACTIVATE_USER",
            `User ${user.username} deactivated by ${req.user?.username}`,
            req.user
        )   

        res.json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

// REACTIVATE USER
exports.reactivateUser = async (req, res) => {
    try {
        const {id} = req.params
        const {role} = req.body

        const user = await User.findByIdAndUpdate(
            id,
            {
                role,
                updatedBy: req.user?.username,
                updatedAt: Date.now(),
            },
            {new: true}
        )

        await logActivity(
            "REACTIVATE_USER",
            `User ${user.username} reactivated by ${req.user?.username}`,
            req.user
        )   

        res.json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}