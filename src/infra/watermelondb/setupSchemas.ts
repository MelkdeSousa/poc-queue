import { appSchema as makeSchema } from '@nozbe/watermelondb'
import { driverSchema } from './entities/Driver/schema'
import { vehicleSchema } from './entities/Vehicle/schema'

export const appSchema = makeSchema({
  version: 1,
  tables: [
    driverSchema,
    vehicleSchema
  ]
})