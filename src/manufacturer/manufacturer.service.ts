import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Manufacturer } from './entities/manufacturer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ManufacturerService {
  constructor(
    @InjectRepository(Manufacturer)
    private manufacturerRepository: Repository<Manufacturer>,
  ) {}

  findAll() {
    return this.manufacturerRepository.find();
  }

  findOneById(id: string): Promise<Manufacturer> {
    return this.manufacturerRepository.findOne({
      where: { id },
    });
  }

  async create(createManufacturerDto: CreateManufacturerDto) {
    const { name, description } = createManufacturerDto;
    const manufacturer = {
      name: name,
      description: description,
    };

    const existingManufacturer = await this.manufacturerRepository.findOne({
      where: {
        name: createManufacturerDto.name,
      },
    });
    if (existingManufacturer) {
      throw new ConflictException('Manufacturer with this name already exists');
    }
    return this.manufacturerRepository.save(manufacturer);
  }

  async findManufacturerById(id: string): Promise<Manufacturer> {
    const result = await this.manufacturerRepository.findOne({
      where: { id },
      relations: ['products'], // Specify the relations to be fetched
    });
    if (!result) {
      throw new NotFoundException('Manufacturer not found');
    }
    return result;
  }

  async updateProductById(
    id: string,
    updateManufacturerDto: UpdateManufacturerDto,
  ) {
    const manufacturer = await this.manufacturerRepository.findOne({
      where: { id },
      relations: ['products'], // Specify the relations to be fetched
    });
    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }
    if (updateManufacturerDto.name) {
      manufacturer.name = updateManufacturerDto.name;
    }
    if (updateManufacturerDto.description) {
      manufacturer.description = updateManufacturerDto.description;
    }
    return this.manufacturerRepository.save(manufacturer);
  }

  async deleteProductById(id: string) {
    const result = await this.manufacturerRepository.delete({
      id,
    });
    if (result.affected === 0) {
      throw new NotFoundException('Manufacturer not found');
    }
  }
}
