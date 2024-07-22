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
import { ManufacturerService } from './manufacturer.service';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/decorators/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/roles/guards/roles.guard';

@ApiTags('Manufacturer')
@UseGuards(AuthGuard, RolesGuard)
@Controller('manufacturer')
@ApiBearerAuth('JWT')
export class ManufacturerController {
  constructor(private readonly manufacturerService: ManufacturerService) {}

  @Post()
  @Roles(Role.Admin)
  create(@Body() createManufacturerDto: CreateManufacturerDto) {
    return this.manufacturerService.create(createManufacturerDto);
  }

  @Get()
  findAll() {
    return this.manufacturerService.findAll();
  }

  @Get(':id')
  findManufacturerById(@Param('id') id: string) {
    return this.manufacturerService.findManufacturerById(id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  updateProductById(
    @Param('id') id: string,
    @Body() updateManufacturerDto: UpdateManufacturerDto,
  ) {
    return this.manufacturerService.updateProductById(
      id,
      updateManufacturerDto,
    );
  }

  @Delete(':id')
  @Roles(Role.Admin)
  deleteProductById(@Param('id') id: string) {
    return this.manufacturerService.deleteProductById(id);
  }
}
