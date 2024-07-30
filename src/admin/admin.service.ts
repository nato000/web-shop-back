import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { hashPassword } from 'src/utils/password-hash';
import { InjectModel } from '@nestjs/sequelize';
import { AdminUser } from './entities/admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(AdminUser)
    private readonly adminUserModel: typeof AdminUser,
  ) {}

  public async findCurrentUser(adminId: string) {
    const admin = await this.getAdminById(adminId);
    if (!admin) {
      throw new NotFoundException(`Admin is not found`);
    }
    delete admin.password;
    return admin;
  }

  async getAllAdmins(): Promise<AdminUser[]> {
    return this.adminUserModel.findAll();
  }

  async getAdminById(id: string): Promise<AdminUser> {
    const admin = await this.adminUserModel.findByPk(id);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    return admin;
  }

  async createAdminUser(createAdminDto: CreateAdminDto): Promise<AdminUser> {
    const { username, email, password, roles } = createAdminDto;

    const existingAdmin = await this.adminUserModel.findOne({
      where: { email },
    });

    if (existingAdmin) {
      throw new ConflictException('Admin with this email already exists');
    }

    const hashedPassword = await hashPassword(password);

    const admin = await this.adminUserModel.create({
      username,
      email,
      password: hashedPassword,
      roles,
    });

    return admin;
  }

  async findByEmail(email: string): Promise<AdminUser> {
    const admin = await this.adminUserModel.findOne({
      where: { email },
    });
    if (!admin) {
      throw new NotFoundException('Email not found');
    }
    return admin;
  }

  async updateAdminById(
    id: string,
    updateAdminDto: UpdateAdminDto,
  ): Promise<AdminUser> {
    const admin = await this.getAdminById(id);

    if (updateAdminDto.username) {
      admin.username = updateAdminDto.username;
    }
    if (updateAdminDto.password) {
      admin.password = await hashPassword(updateAdminDto.password);
    }
    if (updateAdminDto.roles) {
      admin.roles = updateAdminDto.roles;
    }

    await admin.save();
    return admin;
  }

  async updateAdminPasswordById(
    id: string,
    password: string,
  ): Promise<AdminUser> {
    const admin = await this.getAdminById(id);

    admin.password = await hashPassword(password);

    await admin.save();
    return admin;
  }

  async deleteAdminById(id: string): Promise<void> {
    const admin = await this.getAdminById(id);
    await admin.destroy();
  }
}
