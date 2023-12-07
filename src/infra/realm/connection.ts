import { DriverModel } from './models/Driver';

export const realmConnection = await Realm.open({
  schema: [DriverModel],
});
