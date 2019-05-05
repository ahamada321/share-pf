import { Booking } from "../rental-detail/rental-detail-booking/services/booking.model";

export class Rental {

    static readonly CATEGORIES = ["カテゴリ1", "カテゴリ2"]
    _id: string;
    lastLogin: string;
    createdAt: string;

    rentalname: string;
    age: number;
    height: string;
    bust: string;
    weight: string;

    image: string;
    video: string;

    province: string;
    nearStation: string;

    hourlyPrice: number;
    description: string;

    rating: number;
    shared: Boolean;
    user: any;
    bookings: Booking[];
}
