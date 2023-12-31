import { Repository, UpdateResult } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { HasIdInterface } from './hasId.interface';

export class CrudService<Entity extends HasIdInterface> {
  constructor(private repository: Repository<Entity>) {}
  findAll(): Promise<Entity[]> {
    return this.repository.find();
  }

  async create(createDto): Promise<Entity> {
    return this.repository.save(createDto);
  }

  async findOne(id): Promise<Entity> {
    const Entity = await this.repository.findOne({ where: { id: id } });
    if (!Entity) {
      throw new NotFoundException();
    }
    return Entity;
  }

  async update(id, updateDto) {
    const Entity = await this.repository.preload({ id, ...updateDto });
    if (!Entity) {
      throw new NotFoundException();
    }

    return await this.repository.save(Entity);
  }

  async softremove(id) {
    const Entity = await this.repository.findOne({ where: { id } });
    if (!Entity) {
      throw new NotFoundException();
    }
    return await this.repository.remove(Entity);
  }
}