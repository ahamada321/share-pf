import { Booking } from '../rental-detail/rental-detail-booking/services/booking.model';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

export class Rental {

    static readonly CATEGORIES = ["カテゴリ1", "カテゴリ2"];
    _id: string;
    shared: Boolean;
    lastLogin: string;
    createdAt: string;
    lineworksURL: string;
    homepage: string;
    facebook: string;
    instagram: string;
    twitter: string;
    selectedCategory: any[];
    
    rentalname: string;
    email: string;
    age: number;
    height: string;
    bust: string;
    weight: string;

    province: string;
    nearStation: string;

    hourlyPrice: number;
    cardDescription
    headlinedescription1: string;
    headlinedescription2: string;
    description: string;
    appeal1: string;
    appeal2: string;
    appeal3: string;
    course60img: string;
    course90img: string;
    course60Description: string;
    course90Description: string;

    image: string;
    image2: string;
    gallery: string;
    gallery2: string;
    gallery3: string;
    gallery4: string;
    gallery5: string;
    video: string;

    businesshour_enabled_sun: boolean
    businesshour_startTime_sun: NgbTimeStruct
    businesshour_endTime_sun: NgbTimeStruct
    businesshour_enabled_mon: boolean
    businesshour_startTime_mon: NgbTimeStruct
    businesshour_endTime_mon: NgbTimeStruct
    businesshour_enabled_tue: boolean
    businesshour_startTime_tue: NgbTimeStruct
    businesshour_endTime_tue: NgbTimeStruct
    businesshour_enabled_wed: boolean
    businesshour_startTime_wed: NgbTimeStruct
    businesshour_endTime_wed: NgbTimeStruct
    businesshour_enabled_thu: boolean
    businesshour_startTime_thu: NgbTimeStruct
    businesshour_endTime_thu: NgbTimeStruct
    businesshour_enabled_fri: boolean
    businesshour_startTime_fri: NgbTimeStruct
    businesshour_endTime_fri: NgbTimeStruct
    businesshour_enabled_sat: boolean
    businesshour_startTime_sat: NgbTimeStruct
    businesshour_endTime_sat: NgbTimeStruct

    rating: number;
    user: any;
    brand: any;
    favouritesFrom: any[];
    bookings: Booking[];
}
