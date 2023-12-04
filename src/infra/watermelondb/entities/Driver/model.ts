import { Model } from "@nozbe/watermelondb";
import { text } from '@nozbe/watermelondb/decorators';

export class DriverModel extends Model {
    static table = 'drivers'

    @text('name') name: string
}