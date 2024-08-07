import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current.user.decorator';
import { AdminUser } from './entities/admin.entity';

@ApiTags('Admin')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('current-admin')
  public async findMe(@CurrentUser() adminLogged: AdminUser) {
    const response = await this.adminService.findCurrentUser(adminLogged.id);
    return response;
  }

  // @Post()
  // create(@Body() createAdminDto: CreateAdminDto) {
  //   return this.adminService.createAdminUser(createAdminDto);
  // }

  @Get()
  getAllAdmins() {
    return this.adminService.getAllAdmins();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.getAdminById(id);
  }

  @Patch(':id')
  updateAdminById(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return this.adminService.updateAdminById(id, updateAdminDto);
  }

  @Patch(':id')
  updateAdminPasswordById(@Param('id') id: string, @Body() password: string) {
    return this.adminService.updateAdminPasswordById(id, password);
  }

  @Delete(':id')
  deleteAdminById(@Param('id') id: string) {
    return this.adminService.deleteAdminById(id);
  }
}
