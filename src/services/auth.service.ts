import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/user.model";
import { UserDTO, UserResponseDTO } from "../dto/user.dto";

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET as string
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string

const refreshTokenList = new Set<string>()

export const authenticateUser = async ( username: string, password: string): Promise<{ accessToken: string, refreshToken: string } | null> => {
    try {
        const existingUser = await User.findOne({ username })

        if (!existingUser) return null

        const isPasswordValid = await bcrypt.compare(password, existingUser.password)
        if (!isPasswordValid) return null

        const accessToken = jwt.sign(
    {
userId: String(existingUser._id),        username: existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
    },
    JWT_SECRET,
{ expiresIn: "1h" })

        const refreshToken = jwt.sign(
            {
                username: existingUser.username,
            },
            REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        )

        refreshTokenList.add(refreshToken)

        return { accessToken, refreshToken }
    } catch (error) {
        console.error("Authentication error:", error)
        return null
    }
}

export const registerUser = async (user: Omit<UserDTO, '_id'>): Promise<{ user: UserResponseDTO, authTokens: { accessToken: string, refreshToken: string } } | null> => {
    try {
        const existingUser = await User.findOne({ $or: [{ username: user.username }, { email: user.email }] })
        if (existingUser) {
            return null
        }

        const hashedPassword = await bcrypt.hash(user.password, 10)

        const newUser = new User({
    username: user.username,
    email: user.email,
    password: hashedPassword,
    role: "user",
})

        const savedUser = await newUser.save()

        const accessToken = jwt.sign(
    {
userId: String(savedUser._id),        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
)

        const refreshToken = jwt.sign(
            {
                username: savedUser.username,
            },
            REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        )

        refreshTokenList.add(refreshToken)

        const userResponse: UserResponseDTO = {
            _id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            role: savedUser.role,
        }

        return {
            user: userResponse,
            authTokens: { accessToken, refreshToken }
        }
    } catch (error) {
        console.error("Error registering user:", error)
        return null
    }
}

export const validateUser = (user: { username?: string, email?: string, password?: string }): string | null => {
    const { username, email, password } = user

    if (!username || username.trim().length < 3) {
        return "Username must be at least 3 characters long"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
        return "Invalid email address"
    }

    const passwordRegex = /^(?=.*[\W_]).{6,}$/
    if (!password || !passwordRegex.test(password)) {
        return "Password must be at least 6 characters long and include at least one special character"
    }

    return null
}