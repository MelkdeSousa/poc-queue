import { z } from "zod";

const driverSchema = z.object({
    name: z.string(),
    id: z.string(),
})

export type Driver = z.infer<typeof driverSchema>;
export type DriverInput = z.input<typeof driverSchema>;
