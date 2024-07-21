import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminUser } from './entities/admin.entity';
import { hashPassword } from 'src/utils/password-hash';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminUser)
    private readonly adminRepository: Repository<AdminUser>,
  ) {}

  async getAllAdmins(): Promise<AdminUser[]> {
    return await this.adminRepository.find();
  }

  async getAdminsById(id: string): Promise<AdminUser[]> {
    return await this.adminRepository.find({
      where: {
        id: id,
      },
    });
  }

  async createAdminUser(createAdminDto: CreateAdminDto) {
    const { username, email, password, roles } = createAdminDto;

    const existingClient = await this.adminRepository.findOne({
      where: {
        email: email,
      },
    });

    if (existingClient) {
      throw new ConflictException('Client with this email already exists');
    }

    const hashedPassword = await hashPassword(password);

    const client = this.adminRepository.create({
      username: username,
      email: email,
      password: hashedPassword,
      roles: roles,
    });
    console.log('ok');
    return this.adminRepository.save(client);
  }

  async findByEmail(email: string): Promise<AdminUser | undefined> {
    const admin = await this.adminRepository.findOneBy({
      email: email,
    });
    if (!admin) {
      throw new NotFoundException('Email not found');
    }
    return admin;
  }

  async updateAdminById(id: string, updateAdminDto: UpdateAdminDto) {
    const admin = await this.adminRepository.findOne({
      where: { id: id },
    });
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    if (updateAdminDto.username) {
      admin.username = updateAdminDto.username;
    }
    if (updateAdminDto.password) {
      admin.password = updateAdminDto.password;
    }

    return this.adminRepository.save(admin);
  }

  async updateAdminPasswordById(id: string, password: string) {
    const admin = await this.adminRepository.findOne({
      where: { id: id },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    admin.password = await hashPassword(password);

    return this.adminRepository.save(admin);
  }

  async deleteAdminById(id: string): Promise<DeleteResult> {
    const result = await this.adminRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Admin not found');
    }
    return result;
  }
}
