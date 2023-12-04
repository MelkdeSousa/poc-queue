import { Driver, DriverInput } from "./entity"

export type DriverDAO = {
    get: (skip?: number, take?: number) => Promise<Driver[]>
    insert: (driver: DriverInput) => Promise<void>
}