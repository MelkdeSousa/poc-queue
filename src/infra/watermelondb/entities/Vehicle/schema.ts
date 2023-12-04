import { tableSchema } from "@nozbe/watermelondb";

export const vehicleSchema =    tableSchema({
      name: 'vehicles',
      columns: [
        { name: 'plate', type: 'string', isIndexed: true },
      ]
    })