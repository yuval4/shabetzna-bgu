import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unit } from './entities/unit.entity';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit) private unitRepository: Repository<Unit>,
  ) {}

  async findAll(): Promise<Unit[]> {
    return await this.unitRepository.find();
  }
}
