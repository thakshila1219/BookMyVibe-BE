import { Types } from 'mongoose';

export interface BookingDto {
    _id?: Types.ObjectId | string;
    eventId: Types.ObjectId | string;
    userId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    numberOfTickets: number;
    totalPrice: number;
    bookingDate?: Date;
    eventDate: string;
    eventTime: string;
    eventTitle: string;
    eventLocation: string;
    status?: 'confirmed' | 'pending' | 'cancelled' | 'refunded';
    paymentMethod: 'credit-card' | 'debit-card' | 'paypal' | 'bank-transfer';
    paymentStatus?: 'paid' | 'pending' | 'failed' | 'refunded';
    specialRequests?: string;
    ticketCode: string;
    createdAt?: Date;
    updatedAt?: Date;
}