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
    ) { }

    async saveVerificationCode(user: User) {
        let codeData = await this.codeRepository.findOne({
            where: {
                user,
                type: CodeTypes.VERIFICATION
            }
        });

        const code = v4();

        if (codeData) {
            codeData.code = code;
        } else {
            codeData = this.codeRepository.create({
                code,
                type: CodeTypes.VERIFICATION,
                user
            });
        }

        await this.codeRepository.save(codeData);

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
