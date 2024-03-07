import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { AddressService } from "./address.service";
import { CreateAddressDTO } from "./dto/create-address.dto";
import { CurrentUser } from "@common/decorators";
import { JwtPayload } from "@auth/interfaces";
import { ApiTags } from "@nestjs/swagger";
import { MessagePattern } from "@nestjs/microservices";
import { GetAddressRequestDTO } from "./dto/get-address-request.dto";

@ApiTags('Addresses')
@Controller("address")
export class AddressController {
    constructor(private readonly addressService: AddressService) { }

    @Get()
    async findAll(@CurrentUser() user: JwtPayload) {
        return await this.addressService.findAll(user.id);
    }

    @Post()
    async create(@Body() dto: CreateAddressDTO, @CurrentUser() user: JwtPayload) {
        return await this.addressService.create(dto, user.id);
    }

    @Delete(':addressId')
    async delete(@Param('addressId', ParseUUIDPipe) addressId: string, @CurrentUser() user: JwtPayload) {
        return await this.addressService.delete(addressId, user.id);
    }

    @MessagePattern('get_user_address')
    async find(data: GetAddressRequestDTO) {
        return await this.addressService.find(data);
    }
}
