import Realm from 'realm';
import { DriverModel } from './models/Driver';

export const realmConnection = new Realm({
  schema: [DriverModel],
  schemaVersion: 2,
});
