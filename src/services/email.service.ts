
import { emailTransporter } from "../config/email.config";

interface BookingEmailDetails {
    customerName: string;
    customerEmail: string;
    eventTitle: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
    numberOfTickets: number;
    totalPrice: number;
    ticketCode: string;
}

export const sendBookingConfirmationEmail = async (
    booking: BookingEmailDetails
): Promise<void> => {

    const mailOptions = {
        from: `"BookMyVibe" <${process.env.EMAIL_USER}>`,
        to: booking.customerEmail,
        subject: "Booking Confirmation - BookMyVibe",

        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #ddd; border-radius: 10px;">

                <h1 style="color: #4f46e5; text-align: center;">
                    BookMyVibe
                </h1>

                <h2 style="color: #16a34a;">
                    Booking Confirmed!
                </h2>

                <p>Hi ${booking.customerName},</p>

                <p>
                    Thank you for booking with BookMyVibe.
                    Your event booking has been successfully confirmed.
                </p>

                <h3>Booking Details</h3>

                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px;"><b>Event</b></td>
                        <td style="padding: 8px;">${booking.eventTitle}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><b>Date</b></td>
                        <td style="padding: 8px;">${booking.eventDate}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><b>Time</b></td>
                        <td style="padding: 8px;">${booking.eventTime}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><b>Location</b></td>
                        <td style="padding: 8px;">${booking.eventLocation}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><b>Tickets</b></td>
                        <td style="padding: 8px;">${booking.numberOfTickets}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><b>Total Price</b></td>
                        <td style="padding: 8px;">Rs. ${booking.totalPrice}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><b>Ticket Code</b></td>
                        <td style="padding: 8px; color: #4f46e5;">
                            ${booking.ticketCode}
                        </td>
                    </tr>
                </table>

                <p style="margin-top: 25px;">
                    We look forward to seeing you at the event!
                </p>

                <p>
                    Thank you,<br/>
                    <b>BookMyVibe Team</b>
                </p>

            </div>
        `
    };

    await emailTransporter.sendMail(mailOptions);
};
