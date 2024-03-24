import { ValidationOptions, registerDecorator } from 'class-validator';
import { IsExistsConstraint } from './is-exists.constraint';

export type IsExistsConstraintInput = {
    model: string;
    column: string;
};

export function IsExists(
    options: IsExistsConstraintInput,
    validationOptions?: ValidationOptions,
) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'is-exists',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [options],
            validator: IsExistsConstraint,
        });
    };
}