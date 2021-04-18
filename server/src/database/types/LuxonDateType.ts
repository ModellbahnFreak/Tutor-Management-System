import { Constructor, EntityProperty, Platform } from '@mikro-orm/core';
import { DateTime } from 'luxon';
import { LuxonType } from './LuxonType';

export class LuxonDateType extends LuxonType {
    protected getClass(): Constructor<any> {
        return LuxonDateType;
    }

    protected convertDateTimeToString(value: DateTime): string {
        return value.toISODate();
    }

    getSingleColumnType(_prop: EntityProperty, _platform: Platform): string {
        // TODO: Can we use the platform in v5?
        return 'date';
    }
}