import { Theater } from "./Theater";

export class Seat{
    id?: number;
    location?: string;
    reclining?: boolean;
    theaterId?: number;
    theater:Theater
}