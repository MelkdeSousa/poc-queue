import { DriverModel } from './models/Driver';

export const realmConnection = new Realm({
  schema: [DriverModel],
});
