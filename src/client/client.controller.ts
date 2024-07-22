import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.createClient(createClientDto);
  }

  @Get()
  findAll() {
    return this.clientService.findAll();
  }

  @Get(':id')
  findOneClientById(@Param('id') id: string) {
    return this.clientService.findOneClientById(id);
  }

  @Patch(':id')
  updateClientById(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientService.updateClientById(id, updateClientDto);
  }
  @Patch('/updatePassword/:id')
  updateClientPasswordById(@Param('id') id: string, @Body() password: string) {
    return this.clientService.updateClientPasswordById(id, password);
  }

  @Delete(':id')
  deleteClientById(@Param('id') id: string) {
    return this.clientService.deleteClientById(id);
  }
}
