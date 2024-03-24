import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Types } from 'mongoose';

@ValidatorConstraint({ name: 'isObjectId', async: false })
@Injectable()
export class IsObjectId implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!value) {
      return false;
    }
    return Types.ObjectId.isValid(value);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid ObjectId';
  }
}