
import { Request, Response } from "express";
import * as bookingService from "../services/booking.service";
import { sendBookingConfirmationEmail } from "../services/email.service";

// controller function to handle get all bookings
export const getAllBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await bookingService.getAllBookings();
        res.status(200).json(bookings);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Something went wrong" });
    }
};

// controller function to handle get single booking
export const getBooking = async (req: Request, res: Response) => {
    try {
        const bookingId = req.params.id;

        if (!bookingId) {
            res.status(400).json({ error: "Invalid booking ID" });
            return;
        }

        const booking = await bookingService.getBookingById(bookingId);

        if (!booking) {
            res.status(404).json({ error: "Booking not found" });
            return;
        }

        res.status(200).json(booking);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Something went wrong" });
    }
};

// controller function to handle get bookings by user ID
export const getBookingsByUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            res.status(400).json({ error: "Invalid user ID" });
            return;
        }

        const bookings = await bookingService.getBookingsByUserId(userId);
        res.status(200).json(bookings);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Something went wrong" });
    }
};


// controller function to handle get bookings by event ID
export const getBookingsByEvent = async (req: Request, res: Response) => {
    try {
        const eventId = req.params.eventId;

        if (!eventId) {
            res.status(400).json({ error: "Invalid event ID" });
            return;
        }

        const bookings = await bookingService.getBookingsByEventId(eventId);
        res.status(200).json(bookings);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const getMyBookings = async (req: Request, res: Response) => {
    try {
        const user = (req as Request & {
            user?: {
                userId?: string;
                username?: string;
                email?: string;
                role?: string;
            }
        }).user;

        const userId = user?.userId;

        if (!userId) {
            res.status(401).json({
                error: "User ID not found in authentication token"
            });
            return;
        }

        const bookings = await bookingService.getBookingsByUserId(userId);

        res.status(200).json(bookings);

    } catch (error) {
        console.error("Get My Bookings Error:", error);

        res.status(500).json({
            error: "Something went wrong"
        });
    }
};

// controller function to handle get booking by ticket code
export const getBookingByTicketCode = async (req: Request, res: Response) => {
    try {
        const ticketCode = req.params.ticketCode;

        if (!ticketCode) {
            res.status(400).json({ error: "Invalid ticket code" });
            return;
        }

        const booking = await bookingService.getBookingByTicketCode(ticketCode);

        if (!booking) {
            res.status(404).json({ error: "Booking not found" });
            return;
        }

        res.status(200).json(booking);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Something went wrong" });
    }
};

// controller function to handle create a booking

export const saveBooking = async (req: Request, res: Response) => {
    try {
        const newBooking = req.body;

        // Validate booking details
        const validationError = bookingService.validateBooking(newBooking);

        if (validationError) {
            res.status(400).json({ error: validationError });
            return;
        }

        // Save booking to MongoDB
        const savedBooking = await bookingService.saveBooking(newBooking);

        // Send confirmation email
        try {
            await sendBookingConfirmationEmail({
                customerName: savedBooking.customerName,
                customerEmail: savedBooking.customerEmail,
                eventTitle: savedBooking.eventTitle,
                eventDate: savedBooking.eventDate,
                eventTime: savedBooking.eventTime,
                eventLocation: savedBooking.eventLocation,
                numberOfTickets: savedBooking.numberOfTickets,
                totalPrice: savedBooking.totalPrice,
                ticketCode: savedBooking.ticketCode
            });

            console.log(
                "Booking confirmation email sent:",
                savedBooking.customerEmail
            );

        } catch (emailError) {
            // Email failure should not cancel a successful booking
            console.error("Booking email sending failed:", emailError);
        }

        // Return successful booking response
        res.status(201).json(savedBooking);

    } catch (error) {
        console.error("Save Booking Error:", error);

        res.status(500).json({
            error: "Something went wrong"
        });
    }
};


// controller function to handle update a booking
export const updateBooking = async (req: Request, res: Response) => {
    try {
        const bookingId = req.params.id;

        if (!bookingId) {
            res.status(400).json({ error: "Invalid booking ID" });
            return;
        }

        const updatedBooking = await bookingService.updateBooking(
            bookingId,
            req.body
        );

        if (!updatedBooking) {
            res.status(404).json({ error: "Booking not found" });
            return;
        }

        res.status(200).json(updatedBooking);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Something went wrong" });
    }
};

// controller function to handle cancel a booking
export const cancelBooking = async (req: Request, res: Response) => {
    try {
        const bookingId = req.params.id;

        if (!bookingId) {
            res.status(400).json({ error: "Invalid booking ID" });
            return;
        }

        const cancelledBooking = await bookingService.cancelBooking(bookingId);

        if (!cancelledBooking) {
            res.status(404).json({ error: "Booking not found" });
            return;
        }

        res.status(200).json({
            message: "Booking cancelled successfully",
            booking: cancelledBooking
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Something went wrong" });
    }
};

// controller function to handle delete a booking
export const deleteBooking = async (req: Request, res: Response) => {
    try {
        const bookingId = req.params.id;

        if (!bookingId) {
            res.status(400).json({ error: "Invalid booking ID" });
            return;
        }

        const deleted = await bookingService.deleteBooking(bookingId);

        if (!deleted) {
            res.status(404).json({ error: "Booking not found" });
            return;
        }

        res.status(200).json({ message: "Booking deleted successfully" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Something went wrong" });
    }
};
