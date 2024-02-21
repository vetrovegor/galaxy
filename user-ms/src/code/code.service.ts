import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Code, CodeTypes } from './code.entity';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { User } from '@user/user.emtity';

@Injectable()
export class CodeService {
    constructor(
        @InjectRepository(Code)
        private codeRepository: Repository<Code>
    ) {}

    async createVerificationCode(user: User) {
        const code = v4();

        const createdCode = this.codeRepository.create({
            code,
            type: CodeTypes.VERIFICATION,
            user
        });

        await this.codeRepository.save(createdCode);

        return code;
    }

    async validateVerificationCode(code: string) {
        const codeData = await this.codeRepository.findOne({
            where: {
                code
            },
            relations: ['user']
        });

        if (codeData) {
            await this.codeRepository.delete({
                id: codeData.id
            });
        }

        return codeData;
    }
}
