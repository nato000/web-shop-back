import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectModel } from '@nestjs/sequelize';
import { hashPassword } from 'src/utils/password-hash';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client)
    private clientModel: typeof Client,
  ) {}

  public async findCurrentUser(clientId: string) {
    const client = await this.findOneById(clientId);
    if (!client) {
      throw new NotFoundException(`Client is not found`);
    }
    delete client.password;
    return client;
  }

  async findAll() {
    return this.clientModel.findAll();
  }

  async findOneById(id: string) {
    return this.clientModel.findByPk(id);
  }

  async createClient(createClientDto: CreateClientDto) {
    const { name, surname, email, password, roles } = createClientDto;

    const existingClient = await this.clientModel.findOne({
      where: {
        email: email,
      },
    });

    if (existingClient) {
      throw new ConflictException('Client with this email already exists');
    }

    const hashedPassword = await hashPassword(password);

    const client = await this.clientModel.create({
      name,
      surname,
      email,
      password: hashedPassword,
      roles,
    });
    return client;
  }

  async findOneClientById(id: string) {
    const client = await this.clientModel.findByPk(id);
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return client;
  }

  async findByEmail(email: string): Promise<Client | undefined> {
    const client = await this.clientModel.findOne({
      where: {
        email: email,
      },
    });
    if (!client) {
      throw new NotFoundException('Email not found');
    }
    return client;
  }

  async updateClientById(id: string, updateClientDto: UpdateClientDto) {
    const client = await this.clientModel.findByPk(id);
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
    await client.save();
    return client;
  }

  async updateClientPasswordById(id: string, password: string) {
    const client = await this.clientModel.findByPk(id);
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    client.password = await hashPassword(password);
    await client.save();
    return client;
  }

  async deleteClientById(id: string) {
    const result = await this.clientModel.destroy({
      where: {
        id,
      },
    });
    if (result === 0) {
      throw new NotFoundException('Client not found');
    }
  }
}
