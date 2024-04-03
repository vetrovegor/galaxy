import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments
} from 'class-validator';
import { Types } from 'mongoose';

export function IsObjectId(validationOptions?: ValidationOptions) {
    return function (object: Record<string, any>, propertyName: string) {
        registerDecorator({
            name: 'isObjectId',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (!value) return false;
                    if (typeof value !== 'string') return false;
                    return Types.ObjectId.isValid(value);
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be a valid ObjectId`;
                }
            }
        });
    };
}
