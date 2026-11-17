import Event from "../model/event.model";
import { EventDto } from "../dto/event.dto";

export const getAllEvents = async (): Promise<EventDto[]> => {
    const events = await Event.find();
    return events.map(event => event.toObject() as EventDto);
}

export const getEventById = async (id: string): Promise<EventDto | null> => {
    const event = await Event.findById(id);
    return event ? event.toObject() as EventDto : null;
}

export const saveEvent = async (event: EventDto): Promise<EventDto> => {
    const createdEvent = await Event.create(event);
    return createdEvent.toObject() as EventDto;
}

export const updateEvent = async (id: string, data: Partial<EventDto>): Promise<EventDto | null> => {
    const updatedEvent = await Event.findByIdAndUpdate(id, data, { new: true });
    return updatedEvent ? updatedEvent.toObject() as EventDto : null;
}

export const deleteEvent = async (id: string): Promise<boolean> => {
    const result = await Event.deleteOne({ _id: id });
    return result.deletedCount > 0;
}

export const validateEvent = (event: EventDto): string | null => {
    if (!event.title || !event.date || !event.time || !event.location ||
        event.price === undefined || !event.attendees || !event.image || !event.category) {
        return 'Required fields: title, date, time, location, price, attendees, image, category';
    }

    if (event.rating !== undefined && (event.rating < 0 || event.rating > 5)) {
        return 'Rating must be between 0 and 5';
    }

    if (event.status && !['available', 'sold-out', 'coming-soon'].includes(event.status)) {
        return 'Status must be one of: available, sold-out, coming-soon';
    }

    return null;
}


export const searchEvents = async (filters: {
    category?: string;
    location?: string;
    maxPrice?: number;
    status?: string;
}) => {
    const query: any = {};

    if (filters.category) {
        query.category = {
            $regex: filters.category,
            $options: "i"
        };
    }

    if (filters.location) {
        query.location = {
            $regex: filters.location,
            $options: "i"
        };
    }

    if (filters.maxPrice !== undefined) {
        query.price = {
            $lte: filters.maxPrice
        };
    }

    if (filters.status) {
        query.status = filters.status;
    }

    const events = await Event.find(query);

    return events.map(event => event.toObject() as EventDto);
};
