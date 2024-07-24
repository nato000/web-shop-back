import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { CurrentUser } from 'src/auth/decorators/current.user.decorator';
import { Client } from './entities/client.entity';

@ApiTags('Client')
@UseGuards(AuthGuard, RolesGuard)
@Controller('client')
@ApiBearerAuth('JWT')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get('current-client')
  public async findMe(@CurrentUser() clientLogged: Client) {
    const response = await this.clientService.findCurrentUser(clientLogged.id);
    return response;
  }

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
