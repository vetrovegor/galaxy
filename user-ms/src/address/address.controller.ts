import { Body, Controller, Delete, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { AddressService } from "./address.service";
import { CreateAddressDTO } from "./dto/create-address.dto";
import { CurrentUser } from "@common/decorators";
import { JwtPayload } from "@auth/interfaces";

@Controller("address")
export class AddressController {
    constructor(private readonly addressService: AddressService) { }

    @Post()
    async create(@Body() dto: CreateAddressDTO, @CurrentUser() user: JwtPayload) {
        return await this.addressService.create(dto, user.id);
    }

    @Delete(':addressId')
    async delete(@Param('addressId', ParseUUIDPipe) addressId: string, @CurrentUser() user: JwtPayload) {
        return await this.addressService.delete(addressId, user.id);
    }
}
