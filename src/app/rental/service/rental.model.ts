import { Booking } from '../rental-booking/services/booking.model';

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
    image2: string;
    gallery: string;
    gallery2: string;
    gallery3: string;
    gallery4: string;
    gallery5: string;
    video: string;

    province: string;
    nearStation: string;

    hourlyPrice: number;
    description: string;
    headlinedescription1: string;
    headlinedescription2: string;

    rating: number;
    shared: Boolean;
    user: any;
    bookings: Booking[];
}
