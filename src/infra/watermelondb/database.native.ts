import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import { DriverModel } from './entities/Driver/model'
import { VehicleModel } from './entities/Vehicle/model'
import migrations from './setupMigrations'
import { appSchema } from './setupSchemas'

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  schema: appSchema,
  migrations,
  jsi: true,
})

export const database = new Database({
  adapter,
  modelClasses: [
    DriverModel,
    VehicleModel
  ],
})