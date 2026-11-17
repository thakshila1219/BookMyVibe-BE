import User from "../model/user.model";
import { UserDTO, UserResponseDTO } from "../dto/user.dto";
import bcrypt from "bcryptjs";

export const getAllUsers = async (): Promise<UserResponseDTO[]> => {
    const users = await User.find().select('-password')
    return users.map(user => user.toObject() as UserResponseDTO)
}

export const getUserById = async (id: string): Promise<UserResponseDTO | null> => {
    const user = await User.findById(id).select('-password')
    return user ? user.toObject() as UserResponseDTO : null
}

export const getUserByEmail = async (email: string): Promise<UserDTO | null> => {
    const user = await User.findOne({ email: email.toLowerCase() })
    return user ? user.toObject() as UserDTO : null
}

export const getUserByUsername = async (username: string): Promise<UserDTO | null> => {
    const user = await User.findOne({ username })
    return user ? user.toObject() as UserDTO : null
}

export const getUsersByRole = async (role: string): Promise<UserResponseDTO[]> => {
    const users = await User.find({ role }).select('-password')
    return users.map(user => user.toObject() as UserResponseDTO)
}

export const saveUser = async (user: UserDTO): Promise<UserResponseDTO> => {
    // Hash password before saving
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(user.password, saltRounds)

    const userData = {
        ...user,
        password: hashedPassword,
        email: user.email.toLowerCase()
    }

    const createdUser = await User.create(userData)
    const userWithoutPassword = await User.findById(createdUser._id).select('-password')
    return userWithoutPassword!.toObject() as UserResponseDTO
}

export const updateUser = async (id: string, data: Partial<UserDTO>): Promise<UserResponseDTO | null> => {
    // If password is being updated, hash it
    if (data.password) {
        const saltRounds = 10
        data.password = await bcrypt.hash(data.password, saltRounds)
    }

    // Convert email to lowercase if provided
    if (data.email) {
        data.email = data.email.toLowerCase()
    }

    const updatedUser = await User.findByIdAndUpdate(id, data, { new: true }).select('-password')
    return updatedUser ? updatedUser.toObject() as UserResponseDTO : null
}

export const deleteUser = async (id: string): Promise<boolean> => {
    const result = await User.deleteOne({ _id: id })
    return result.deletedCount > 0
}

export const changePassword = async (id: string, newPassword: string): Promise<boolean> => {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

    const result = await User.updateOne(
        { _id: id },
        { password: hashedPassword }
    )
    return result.modifiedCount > 0
}

export const validateUser = (user: UserDTO): string | null => {
    // Required fields validation
    if (!user.username || !user.email || !user.password || !user.role) {
        return 'Required fields: username, email, password, role'
    }

    // Username validation (no spaces, minimum length)
    if (user.username.length < 3) {
        return 'Username must be at least 3 characters long'
    }

    if (user.username.includes(' ')) {
        return 'Username cannot contain spaces'
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(user.email)) {
        return 'Invalid email format'
    }

    // Password validation
    if (user.password.length < 6) {
        return 'Password must be at least 6 characters long'
    }

    // Role validation
    if (!['admin', 'user'].includes(user.role)) {
        return 'Role must be either admin or user'
    }

    return null
}

export const validateUserUpdate = (user: Partial<UserDTO>): string | null => {
    // Username validation if provided
    if (user.username) {
        if (user.username.length < 3) {
            return 'Username must be at least 3 characters long'
        }

        if (user.username.includes(' ')) {
            return 'Username cannot contain spaces'
        }
    }

    // Email validation if provided
    if (user.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(user.email)) {
            return 'Invalid email format'
        }
    }

    // Password validation if provided
    if (user.password && user.password.length < 6) {
        return 'Password must be at least 6 characters long'
    }

    // Role validation if provided
    if (user.role && !['admin', 'user'].includes(user.role)) {
        return 'Role must be either admin or user'
    }

    return null
}