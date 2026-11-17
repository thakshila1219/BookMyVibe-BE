import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
    {
        "title": {
            type: String,
            required: true
        },
        "date": {
            type: String,
            required: true
        },
        "time": {
            type: String,
            required: true
        },
        "location": {
            type: String,
            required: true
        },
        "price": {
            type: Number,
            required: true
        },
        "attendees": {
            type: Number,
            required: true
        },
        "image": {
            type: String,
            required: true
        },
        "category": {
            type: String,
            required: true
        },
        "description": {
            type: String
        },
        "rating": {
            type: Number,
            min: 0,
            max: 5
        },
        "reviews": {
            type: Number
        },
        "organizer": {
            type: String
        },
        "status": {
            type: String,
            enum: ['available', 'sold-out', 'coming-soon'],
            default: 'available'
        }
    }
)

const Event = mongoose.model("Event", EventSchema);

export default Event;
