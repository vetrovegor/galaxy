import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Address } from "./address.entity";
import { CreateAddressDTO } from "./dto/create-address.dto";
import { UserService } from "@user/user.service";
import { GetAddressRequestDTO } from "./dto/get-address-request.dto";

@Injectable()
export class AddressService {
    constructor(
        @InjectRepository(Address) private readonly addressRepository: Repository<Address>,
        private readonly userService: UserService
    ) { }

    async findAll(userId: string) {
        const address = await this.addressRepository.find({
            where: {
                user: { id: userId }
            },
        });

        return { address };
    }

    async create(dto: CreateAddressDTO, userId: string) {
        const user = await this.userService.findById(userId);

        const address = this.addressRepository.create({ ...dto, user });

        return await this.addressRepository.save(address);
    }

    async delete(id: string, userId: string) {
        const address = await this.addressRepository.findOne({
            where: {
                id,
            },
            relations: ['user']
        });

        if (!address || address.user.id != userId) {
            throw new NotFoundException("Адрес не найден");
        }

        await this.addressRepository.delete(address);

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
