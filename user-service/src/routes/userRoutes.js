const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// PUBLIC
router.post("/login", userController.login);

// ADMIN ONLY
router.post("/register", verifyToken, isAdmin, userController.register);

router.get("/", verifyToken, isAdmin, userController.getUser);

router.put("/:id", verifyToken, isAdmin, userController.updateUser);

router.delete("/:id", verifyToken, isAdmin, userController.deleteUser);

router.put("/deactivate/:id", verifyToken, isAdmin, userController.deactivateUser);

router.put("/reactivate/:id", verifyToken, isAdmin, userController.reactivateUser);

module.exports = router;