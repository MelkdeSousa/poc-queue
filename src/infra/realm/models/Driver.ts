import Realm from 'realm';

export class DriverModel extends Realm.Object<DriverModel> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  timestamp: number = Math.round(new Date().getTime() / 1000);

  static schema: Realm.ObjectSchema = {
    name: 'Driver',
    properties: {
      _id: { type: 'objectId', indexed: true },
      name: { type: 'string' },
      timestamp: {
        type: 'int',
        default: () => Math.round(new Date().getTime() / 1000),
      },
    },
    primaryKey: 'name',
  };
}
