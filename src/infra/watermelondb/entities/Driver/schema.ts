import { tableSchema } from "@nozbe/watermelondb";

export const driverSchema = tableSchema({
      name: 'drivers',
      columns: [
        // { name: 'document_type', type: 'string', },
        // { name: 'document_number', type: 'string', isIndexed: true, isOptional: true },
        // { name: 'document_expiration_date', type: 'string', isOptional: true },
        // { name: 'document_state', type: 'string', isOptional: true },
        // { name: 'document_country', type: 'string', isOptional: true },
        // { name: 'updated_at', type: 'number', isIndexed: true },
        // { name: 'created_at', type: 'number', isIndexed: true },
        { name: 'name', type: 'string', isIndexed: true },
      ]
    })