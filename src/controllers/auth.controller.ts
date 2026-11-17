import {Request, Response} from "express";
import * as authService from "../services/auth.service";

export const authenticateUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body
        const authTokens = await authService.authenticateUser(username, password)

        if (!authTokens) {
            res.status(401).json({ error: "Invalid credentials" })
            return
        }

        res.json(authTokens)
    } catch (error) {
        console.error("Authentication failed:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const registerUser = async (req: Request, res: Response) => {
    try {
        const newUser = req.body

        if (!newUser.username || !newUser.email || !newUser.password) {
            res.status(400).json({ error: "Username, email, and password are required" })
            return
        }

        const registrationError = authService.validateUser(newUser)
        if (registrationError) {
            res.status(400).json({ error: registrationError })
            return
        }

        const result = await authService.registerUser(newUser)
        if (!result) {
            res.status(400).json({ error: "Registration failed: Username or email may already exist" })
            return
        }

        res.status(201).json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Something went wrong" })
    }
}