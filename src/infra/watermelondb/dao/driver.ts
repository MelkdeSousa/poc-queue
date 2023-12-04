import { DriverDAO } from '@/core/drivers/contracts';
import { Driver, DriverInput } from '@/core/drivers/entity';
import { Q } from '@nozbe/watermelondb';
import { database } from '../database.native';
import { DriverModel } from '../entities/Driver/model';

export class DriverDAOWatermelonDB implements DriverDAO {
    async get(skip: number = 0, take: number = 20): Promise<Driver[]> {
        const drivers = await database.get<DriverModel>('drivers').query(
            Q.skip(skip),
            Q.take(take)
        )

        return drivers.map(d => ({
            id: d.id,
            name: d.name
        }))
    }

    async insert(driver: DriverInput): Promise<void> {
        await database.get<DriverModel>('drivers').create(record => {
            record.name = driver.name
        })
    }
}