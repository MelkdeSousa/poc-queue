import { AWS_ACCESS_KEY_ID, AWS_DRIVER_LOAD, AWS_SECRET_ACCESS_KEY, AWS_VEHICLE_LOAD } from '@env';
import { z } from 'zod';

const EnvSchema = z.object({
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_DRIVER_LOAD: z.string().url(),
  AWS_VEHICLE_LOAD: z.string().url(),
});

export const envs = EnvSchema.parse({
  AWS_ACCESS_KEY_ID,
  AWS_DRIVER_LOAD,
  AWS_SECRET_ACCESS_KEY,
  AWS_VEHICLE_LOAD,
});
