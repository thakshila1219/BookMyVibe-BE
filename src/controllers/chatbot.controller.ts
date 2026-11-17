
import { Request, Response } from "express";
import { sendMessageToGemini } from "../services/chatbot.service";

export const chatbotController = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== "string" || !message.trim()) {
            res.status(400).json({
                success: false,
                message: "Please enter a valid message.",
            });
            return;
        }

        const reply = await sendMessageToGemini(message.trim());

        res.status(200).json({
            success: true,
            reply,
        });

    } catch (error) {
        console.error("Chatbot Controller Error:", error);

        res.status(500).json({
            success: false,
            message: "Sorry, the chatbot is temporarily unavailable.",
        });
    }
};
