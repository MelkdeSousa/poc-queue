import Realm, { ObjectSchema } from 'realm';

export class DriverModel extends Realm.Object<DriverModel> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  timestamp: number = Math.round(new Date().getTime() / 1000);

  static schema: ObjectSchema = {
    name: 'Driver',
    properties: {
      _id: 'objectId',
      name: { type: 'string', indexed: 'full-text' },
      timestamp: {
        type: 'int',
        default: () => Math.round(new Date().getTime() / 1000),
      },
    },
    primaryKey: '_id',
  };
}
