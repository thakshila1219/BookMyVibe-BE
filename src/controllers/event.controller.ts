import { Request, Response } from "express";
import * as eventService from "../services/event.service";

export const getAllEvents = async (req: Request, res: Response) => {
    try {
        const events = await eventService.getAllEvents();

        console.log("Events from Database:", events);
        console.log("Events Count:", events.length);

        res.status(200).json(events);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Something went wrong" });
    }
}

export const getEvent = async (req: Request, res: Response) => {
    try {
        const eventId = req.params.id;
        if (!eventId) {
            res.status(400).json({ error: "Invalid event ID" });
            return;
        }

        const event = await eventService.getEventById(eventId);
        if (!event) {
            res.status(404).json({ error: "Event not found" });
            return;
        }
        res.status(200).json(event);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Something went wrong" });
    }
}

export const saveEvent = async (req: Request, res: Response) => {
    try {
        const newEvent = req.body;
        const validationError = eventService.validateEvent(newEvent);
        if (validationError) {
            res.status(400).json({ error: validationError });
            return;
        }
        const savedEvent = await eventService.saveEvent(newEvent);
        res.status(201).json(savedEvent);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Something went wrong" });
    }
}

export const updateEvent = async (req: Request, res: Response) => {
    try {
        const eventId = req.params.id;
        if (!eventId) {
            res.status(400).json({ error: "Invalid event ID" });
            return;
        }

        const updatedEvent = await eventService.updateEvent(eventId, req.body);
        if (!updatedEvent) {
            res.status(404).json({ error: "Event not found" });
            return;
        }
        res.status(200).json(updatedEvent);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Something went wrong" });
    }
}

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const eventId = req.params.id;
        if (!eventId) {
            res.status(400).json({ error: "Invalid event ID" });
            return;
        }

        const deleted = await eventService.deleteEvent(eventId);
        if (!deleted) {
            res.status(404).json({ error: "Event not found" });
            return;
        }
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Something went wrong" });
    }
}