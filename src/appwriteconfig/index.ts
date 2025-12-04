import type { Models } from "appwrite";

export interface Rental extends Models.Document {
    "unit-id": string;
    "unit-status": string;
    "users": string;
    "type_id": string;
    "tenant_id": string;
}
export interface Property extends Models.Document {
    "property_name": string;
    "location": string;
    "users": string;
}
export interface UnitType extends Models.Document {
    "name": string;
    "rent": number;
    "property_id": string;
    "count": number;
}
export interface Tenant extends Models.Document {
    "name": string;
    "contact": string;
    "start_date": string;
}
export interface Payment extends Models.Document {
    "amount": number;
    "payment_date": string;
    "rental_unit_id": string;
    "payment_method": string;
    "payment_type": string;
    "period_of_bill": string;
}
