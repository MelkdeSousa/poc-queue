import { Model } from "@nozbe/watermelondb";
import { text } from '@nozbe/watermelondb/decorators';

export class VehicleModel extends Model {
    static table = 'vehicles'

    @text('name') name: string
}