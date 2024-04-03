import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './address.entity';
import { CreateAddressDTO } from './dto/create-address.dto';
import { UserService } from '@user/user.service';
import { GetAddressRequestDTO } from './dto/get-address-request.dto';

@Injectable()
export class AddressService {
    constructor(
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>,
        private readonly userService: UserService
    ) {}

    async findAll(userId: string) {
        const address = await this.addressRepository.find({
            where: {
                user: { id: userId }
            }
        });

        return { address };
    }

    async create(dto: CreateAddressDTO, userId: string) {
        const existedUser = await this.userService.findById(userId);

        const createdAddress = this.addressRepository.create({
            ...dto,
            user: existedUser
        });

        const { user, ...address } =
            await this.addressRepository.save(createdAddress);

        return address;
    }

    async delete(id: string, userId: string) {
        const address = await this.addressRepository.findOne({
            where: {
                id,
                user: { id: userId }
            }
        });

        if (!address) {
            throw new NotFoundException('Адрес не найден');
        }

        await this.addressRepository.delete(id);

        return address;
    }

    async find({ userId, addressId }: GetAddressRequestDTO) {
        try {
            const address = await this.addressRepository.findOne({
                where: {
                    id: addressId,
                    user: { id: userId }
                }
            });

            return address;
        } catch (error) {
            return null;
        }
    }
}
