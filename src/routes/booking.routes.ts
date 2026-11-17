import { Router } from "express";

import {
    getAllBookings,
    getBooking,
    getBookingsByEvent,
    getBookingsByUser,
    getBookingByTicketCode,
    getMyBookings,
    saveBooking,
    updateBooking,
    cancelBooking,
    deleteBooking
} from "../controllers/booking.controller";

import { authorizeRoles } from "../middleware/auth.middleware";

const bookingRouter: Router = Router();

bookingRouter.get("/", authorizeRoles('admin'), getAllBookings);

// Customer's own bookings
bookingRouter.get("/my-bookings", getMyBookings);

bookingRouter.get("/user/:userId", getBookingsByUser);
bookingRouter.get("/event/:eventId", getBookingsByEvent);
bookingRouter.get("/ticket/:ticketCode", getBookingByTicketCode);

bookingRouter.get("/:id", getBooking);

bookingRouter.post("/", saveBooking);
bookingRouter.put("/:id", updateBooking);
bookingRouter.patch("/:id/cancel", cancelBooking);

bookingRouter.delete("/:id", authorizeRoles('admin'), deleteBooking);

export default bookingRouter;