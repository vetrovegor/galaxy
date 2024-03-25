import { Controller, Get, HttpStatus } from '@nestjs/common';

@Controller('api/v1')
export class AppController {
    @Get('health')
    checkHealth() {
        return HttpStatus.OK;
    }
}
