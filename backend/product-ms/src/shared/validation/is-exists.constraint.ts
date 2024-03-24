import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { IsExistsConstraintInput } from "./is-exists.decorator";
import { Connection } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";

@ValidatorConstraint({ name: 'IsExistsConstraint', async: true })
@Injectable()
export class IsExistsConstraint implements ValidatorConstraintInterface {
    constructor(
        @InjectConnection() private readonly connection: Connection
    ) { }

    async validate(value: any, args?: ValidationArguments): Promise<boolean> {
        try {
            const { model, column }: IsExistsConstraintInput = args.constraints[0];

            const result = await this.connection
                .model(model)
                .where({ [column]: value })
                .exec();

            return result.length > 0;
        } catch (error) {
            return false;
        }
    }

    defaultMessage?(args?: ValidationArguments): string {
        const { model }: IsExistsConstraintInput = args.constraints[0];
        return `${model} not found`;
    }
}