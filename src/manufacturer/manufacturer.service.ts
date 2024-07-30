import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Manufacturer } from './entities/manufacturer.entity';

@Injectable()
export class ManufacturerService {
  constructor(
    @InjectModel(Manufacturer)
    private manufacturerModel: typeof Manufacturer,
  ) {}

  async findAll() {
    return this.manufacturerModel.findAll();
  }

  async findOneById(id: string): Promise<Manufacturer> {
    return this.manufacturerModel.findByPk(id);
  }

  async create(createManufacturerDto: CreateManufacturerDto) {
    const { name, description } = createManufacturerDto;

    const existingManufacturer = await this.manufacturerModel.findOne({
      where: {
        name: name,
      },
    });

    if (existingManufacturer) {
      throw new ConflictException('Manufacturer with this name already exists');
    }

    return this.manufacturerModel.create({
      name,
      description,
    });
  }

  async findManufacturerById(id: string): Promise<Manufacturer> {
    const result = await this.manufacturerModel.findByPk(id, {
      include: ['products'], // Specify the relations to be fetched
    });
    if (!result) {
      throw new NotFoundException('Manufacturer not found');
    }
    return result;
  }

  async updateManufacturerById(
    id: string,
    updateManufacturerDto: UpdateManufacturerDto,
  ) {
    const manufacturer = await this.manufacturerModel.findByPk(id, {
      include: ['products'], // Specify the relations to be fetched
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

    await manufacturer.save(); // Save the updated manufacturer
    return manufacturer;
  }

  async deleteManufacturerById(id: string) {
    const result = await this.manufacturerModel.destroy({
      where: {
        id,
      },
    });
    if (result === 0) {
      throw new NotFoundException('Manufacturer not found');
    }
  }
}
