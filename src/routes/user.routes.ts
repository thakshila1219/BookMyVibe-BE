import { Router } from "express";
import {
    changePassword,
    deleteUser,
    getAllUsers,
    getUser,
    getUserByEmail,
    getUserByUsername,
    getUsersByRole,
    saveUser,
    updateUser
} from "../controllers/user.controller";
import { authorizeRoles } from "../middleware/auth.middleware";

const userRouter: Router = Router();

// GET routes
userRouter.get("/", authorizeRoles('admin'), getAllUsers);
userRouter.get("/id/:id", getUser);
userRouter.get("/email/:email", authorizeRoles('admin'), getUserByEmail);
userRouter.get("/username/:username", authorizeRoles('admin'), getUserByUsername);
userRouter.get("/role/:role", authorizeRoles('admin'), getUsersByRole);

// POST route
userRouter.post("/", saveUser);

// PUT routes
userRouter.put("/:id", updateUser);
userRouter.put("/:id/password", changePassword);

// DELETE route
userRouter.delete("/:id", deleteUser);

export default userRouter;
