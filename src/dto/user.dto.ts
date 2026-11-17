import { Types } from 'mongoose';

export interface UserDTO {
    _id: Types.ObjectId | string;
    username: string;
    email: string;
    password: string;
    role: string;
}

// DTO for user response (excluding password)
export interface UserResponseDTO {
    _id: Types.ObjectId | string | unknown;
    username: string;
    email: string;
    role: string;
}