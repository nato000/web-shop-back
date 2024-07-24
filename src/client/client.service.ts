import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { hashPassword } from 'src/utils/password-hash';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  public async findCurrentUser(clientId: string) {
    const client = await this.findOneById(clientId);
    delete client.password;
    if (!client) {
      throw new NotFoundException(`Client is not found`);
    }
    return client;
  }

  findAll() {
    return this.clientRepository.find();
  }

  findOneById(id: string) {
    return this.clientRepository.findOne({
      where: { id },
    });
  }

  async createClient(createClientDto: CreateClientDto) {
    const { name, surname, email, password, roles } = createClientDto;

    const existingClient = await this.clientRepository.findOne({
      where: {
        email: email,
      },
    });

    if (existingClient) {
      throw new ConflictException('Client with this email already exists');
    }

    const hashedPassword = await hashPassword(password);

    const client = this.clientRepository.create({
      name: name,
      surname: surname,
      email: email,
      password: hashedPassword,
      roles: roles,
    });
    console.log('ok');
    return this.clientRepository.save(client);
  }

  async findOneClientById(id: string) {
    const result = await this.clientRepository.findOne({
      where: { id },
    });
    if (!result) {
      throw new NotFoundException('Client not found');
    }
    return result;
  }

  async findByEmail(email: string): Promise<Client | undefined> {
    const admin = await this.clientRepository.findOneBy({
      email: email,
    });
    if (!admin) {
      throw new NotFoundException('Email not found');
    }
    return admin;
  }

  async updateClientById(id: string, updateClientDto: UpdateClientDto) {
    const client = await this.clientRepository.findOne({
      where: { id: id },
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    if (updateClientDto.name) {
      client.name = updateClientDto.name;
    }
    if (updateClientDto.surname) {
      client.surname = updateClientDto.surname;
    }
    if (updateClientDto.imagePath) {
      client.imagePath = updateClientDto.imagePath;
    }
    return this.clientRepository.save(client);
  }

  async updateClientPasswordById(id: string, password: string) {
    const client = await this.clientRepository.findOne({
      where: { id: id },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }
    client.password = await hashPassword(password);

    return this.clientRepository.save(client);
  }

  async deleteClientById(id: string) {
    const result = await this.clientRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Client not found');
    }
  }
}
