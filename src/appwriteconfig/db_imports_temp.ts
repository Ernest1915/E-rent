
import { account, databases, uniqueId, Query } from "../appwriteconfig/config";
import type { Rental, Property, UnitType, Tenant, Payment } from "../appwriteconfig/index";
export type { Rental, Property, UnitType, Tenant, Payment };


const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const RENTAL_COLLECTION_ID = import.meta.env.VITE_APPWRITE_RENTAL_COLLECTION_ID;
const TENANT_COLLECTION_ID = import.meta.env.VITE_APPWRITE_TENANT_COLLECTION_ID;
const PAYMENT_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PAYMENT_COLLECTION_ID;
const PROPERTIES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROPERTIES_COLLECTION_ID;
const UNIT_TYPES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_UNIT_TYPES_COLLECTION_ID;
