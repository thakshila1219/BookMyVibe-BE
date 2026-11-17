import { Request, Response } from "express";
import * as userService from "../services/user.service";

// Custom error interface for MongoDB errors
interface MongoError extends Error {
    code?: number;
    keyValue?: Record<string, any>;
}

// controller function to handle get all users
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers()
        res.status(200).json(users)
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: "Something went wrong" })
    }
}

// controller function to handle get single user
export const getUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id
        if (!userId) {
            res.status(400).json({ error: "Invalid user ID" })
            return
        }

        const user = await userService.getUserById(userId)
        if (!user) {
            res.status(404).json({ error: "User not found" })
            return
        }
        res.status(200).json(user)
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: "Something went wrong" })
    }
}

// controller function to handle get user by email
export const getUserByEmail = async (req: Request, res: Response) => {
    try {
        const email = req.params.email
        if (!email) {
            res.status(400).json({ error: "Invalid email" })
            return
        }

        const user = await userService.getUserByEmail(email)
        if (!user) {
            res.status(404).json({ error: "User not found" })
            return
        }

        // Remove password from response
        const { password, ...userWithoutPassword } = user
        res.status(200).json(userWithoutPassword)
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: "Something went wrong" })
    }
}

// controller function to handle get user by username
export const getUserByUsername = async (req: Request, res: Response) => {
    try {
        const username = req.params.username
        if (!username) {
            res.status(400).json({ error: "Invalid username" })
            return
        }

        const user = await userService.getUserByUsername(username)
        if (!user) {
            res.status(404).json({ error: "User not found" })
            return
        }

        // Remove password from response
        const { password, ...userWithoutPassword } = user
        res.status(200).json(userWithoutPassword)
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: "Something went wrong" })
    }
}

// controller function to handle get users by role
export const getUsersByRole = async (req: Request, res: Response) => {
    try {
        const role = req.params.role
        if (!role) {
            res.status(400).json({ error: "Invalid role" })
            return
        }

        if (!['admin', 'user'].includes(role)) {
            res.status(400).json({ error: "Role must be either admin or user" })
            return
        }

        const users = await userService.getUsersByRole(role)
        res.status(200).json(users)
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: "Something went wrong" })
    }
}

// controller function to handle create a user
export const saveUser = async (req: Request, res: Response) => {
    try {
        const newUser = req.body
        const validationError = userService.validateUser(newUser)
        if (validationError) {
            res.status(400).json({ error: validationError })
            return
        }

        // Check if username already exists
        const existingUserByUsername = await userService.getUserByUsername(newUser.username)
        if (existingUserByUsername) {
            res.status(409).json({ error: "Username already exists" })
            return
        }

        // Check if email already exists
        const existingUserByEmail = await userService.getUserByEmail(newUser.email)
        if (existingUserByEmail) {
            res.status(409).json({ error: "Email already exists" })
            return
        }

        const savedUser = await userService.saveUser(newUser)
        res.status(201).json(savedUser)
    } catch (e) {
        console.error(e)
        const mongoError = e as MongoError
        if (mongoError.code === 11000) {
            // MongoDB duplicate key error
            const field = mongoError.keyValue ? Object.keys(mongoError.keyValue)[0] : 'field'
            res.status(409).json({ error: `${field} already exists` })
        } else {
            res.status(500).json({ error: "Something went wrong" })
        }
    }
}

// controller function to handle update a user
export const updateUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id
        if (!userId) {
            res.status(400).json({ error: "Invalid user ID" })
            return
        }

        const validationError = userService.validateUserUpdate(req.body)
        if (validationError) {
            res.status(400).json({ error: validationError })
            return
        }

        // Check if username already exists (if being updated)
        if (req.body.username) {
            const existingUserByUsername = await userService.getUserByUsername(req.body.username)
            if (existingUserByUsername && existingUserByUsername._id && existingUserByUsername._id.toString() !== userId) {
                res.status(409).json({ error: "Username already exists" })
                return
            }
        }

        // Check if email already exists (if being updated)
        if (req.body.email) {
            const existingUserByEmail = await userService.getUserByEmail(req.body.email)
            if (existingUserByEmail && existingUserByEmail._id && existingUserByEmail._id.toString() !== userId) {
                res.status(409).json({ error: "Email already exists" })
                return
            }
        }

        const updatedUser = await userService.updateUser(userId, req.body)
        if (!updatedUser) {
            res.status(404).json({ error: "User not found" })
            return
        }
        res.status(200).json(updatedUser)
    } catch (e) {
        console.error(e)
        const mongoError = e as MongoError
        if (mongoError.code === 11000) {
            // MongoDB duplicate key error
            const field = mongoError.keyValue ? Object.keys(mongoError.keyValue)[0] : 'field'
            res.status(409).json({ error: `${field} already exists` })
        } else {
            res.status(500).json({ error: "Something went wrong" })
        }
    }
}

// controller function to handle change password
export const changePassword = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id
        const { newPassword } = req.body

        if (!userId) {
            res.status(400).json({ error: "Invalid user ID" })
            return
        }

        if (!newPassword) {
            res.status(400).json({ error: "New password is required" })
            return
        }

        if (newPassword.length < 6) {
            res.status(400).json({ error: "Password must be at least 6 characters long" })
            return
        }

        const success = await userService.changePassword(userId, newPassword)
        if (!success) {
            res.status(404).json({ error: "User not found" })
            return
        }

        res.status(200).json({ message: "Password changed successfully" })
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: "Something went wrong" })
    }
}

// controller function to handle delete a user
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id
        if (!userId) {
            res.status(400).json({ error: "Invalid user ID" })
            return
        }

        const deleted = await userService.deleteUser(userId)
        if (!deleted) {
            res.status(404).json({ error: "User not found" })
            return
        }
        res.status(200).json({ message: "User deleted successfully" })
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: "Something went wrong" })
    }
}