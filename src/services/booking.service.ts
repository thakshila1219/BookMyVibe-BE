import Booking from "../model/booking.model";
import { BookingDto } from "../dto/booking.dto";

export const getAllBookings = async (): Promise<BookingDto[]> => {
    const bookings = await Booking.find().populate('eventId')
    return bookings.map(booking => booking.toObject() as BookingDto)
}

export const getBookingById = async (id: string): Promise<BookingDto | null> => {
    const booking = await Booking.findById(id).populate('eventId')
    return booking ? booking.toObject() as BookingDto : null
}

export const getBookingsByUserId = async (userId: string): Promise<BookingDto[]> => {
    const bookings = await Booking.find({ userId }).populate('eventId')
    return bookings.map(booking => booking.toObject() as BookingDto)
}

export const getBookingsByEventId = async (eventId: string): Promise<BookingDto[]> => {
    const bookings = await Booking.find({ eventId }).populate('eventId')
    return bookings.map(booking => booking.toObject() as BookingDto)
}

export const getBookingByTicketCode = async (ticketCode: string): Promise<BookingDto | null> => {
    const booking = await Booking.findOne({ ticketCode }).populate('eventId')
    return booking ? booking.toObject() as BookingDto : null
}

export const saveBooking = async (booking: BookingDto): Promise<BookingDto> => {
    // Generate unique ticket code if not provided
    if (!booking.ticketCode) {
        booking.ticketCode = generateTicketCode()
    }

    const createdBooking = await Booking.create(booking)
    const populatedBooking = await Booking.findById(createdBooking._id).populate('eventId')
    return populatedBooking!.toObject() as BookingDto
}

export const updateBooking = async (id: string, data: Partial<BookingDto>): Promise<BookingDto | null> => {
    const updatedBooking = await Booking.findByIdAndUpdate(id, data, { new: true }).populate('eventId')
    return updatedBooking ? updatedBooking.toObject() as BookingDto : null
}

export const deleteBooking = async (id: string): Promise<boolean> => {
    const result = await Booking.deleteOne({ _id: id })
    return result.deletedCount > 0
}

export const cancelBooking = async (id: string): Promise<BookingDto | null> => {
    const cancelledBooking = await Booking.findByIdAndUpdate(
        id,
        { status: 'cancelled', paymentStatus: 'refunded' },
        { new: true }
    ).populate('eventId')
    return cancelledBooking ? cancelledBooking.toObject() as BookingDto : null
}

export const validateBooking = (booking: BookingDto): string | null => {
    // Required fields validation
    if (!booking.eventId || !booking.userId || !booking.customerName ||
        !booking.customerEmail || !booking.customerPhone || !booking.numberOfTickets ||
        !booking.totalPrice || !booking.eventDate || !booking.eventTime ||
        !booking.eventTitle || !booking.eventLocation || !booking.paymentMethod) {
        return 'Required fields: eventId, userId, customerName, customerEmail, customerPhone, numberOfTickets, totalPrice, eventDate, eventTime, eventTitle, eventLocation, paymentMethod'
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(booking.customerEmail)) {
        return 'Invalid email format'
    }

    // Number of tickets validation
    if (booking.numberOfTickets < 1) {
        return 'Number of tickets must be at least 1'
    }

    // Total price validation
    if (booking.totalPrice <= 0) {
        return 'Total price must be greater than 0'
    }

    // Status validation
    if (booking.status && !['confirmed', 'pending', 'cancelled', 'refunded'].includes(booking.status)) {
        return 'Status must be one of: confirmed, pending, cancelled, refunded'
    }

    // Payment method validation
    if (!['credit-card', 'debit-card', 'paypal', 'bank-transfer'].includes(booking.paymentMethod)) {
        return 'Payment method must be one of: credit-card, debit-card, paypal, bank-transfer'
    }

    // Payment status validation
    if (booking.paymentStatus && !['paid', 'pending', 'failed', 'refunded'].includes(booking.paymentStatus)) {
        return 'Payment status must be one of: paid, pending, failed, refunded'
    }

    return null
}

// Helper function to generate unique ticket code
const generateTicketCode = (): string => {
    const timestamp = Date.now().toString()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `TKT-${timestamp.slice(-6)}-${random}`
}