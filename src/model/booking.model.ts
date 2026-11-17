import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
    {
        "eventId": {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
            required: true
        },
        "userId": {
            type: String,
            required: true
        },
        "customerName": {
            type: String,
            required: true
        },
        "customerEmail": {
            type: String,
            required: true
        },
        "customerPhone": {
            type: String,
            required: true
        },
        "numberOfTickets": {
            type: Number,
            required: true,
            min: 1
        },
        "totalPrice": {
            type: Number,
            required: true
        },
        "bookingDate": {
            type: Date,
            default: Date.now
        },
        "eventDate": {
            type: String,
            required: true
        },
        "eventTime": {
            type: String,
            required: true
        },
        "eventTitle": {
            type: String,
            required: true
        },
        "eventLocation": {
            type: String,
            required: true
        },
        "status": {
            type: String,
            enum: ['confirmed', 'pending', 'cancelled', 'refunded'],
            default: 'confirmed'
        },
        "paymentMethod": {
            type: String,
            enum: ['credit-card', 'debit-card', 'paypal', 'bank-transfer'],
            required: true
        },
        "paymentStatus": {
            type: String,
            enum: ['paid', 'pending', 'failed', 'refunded'],
            default: 'paid'
        },
        "specialRequests": {
            type: String
        },
        "ticketCode": {
            type: String,
            unique: true,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Booking = mongoose.model("Booking", BookingSchema)
export default Booking