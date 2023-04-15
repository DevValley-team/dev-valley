import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./entities/category.entity";
import { CreateCategoryDto } from "./dtos/create-category.dto";
import { UpdateCategoryDto } from "./dtos/update-category.dto";

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);

    const categoryExists = await this.categoryRepository.findOne({ where: { name: category.name } });
    if (categoryExists) throw new BadRequestException('Category already exists');

    const result = await this.categoryRepository.insert(category);
    return result.generatedMaps[0].id;
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findOneById(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) throw new BadRequestException('Category not found');

    return category;
  }

  async findOneByName(name: string) {
    const category = await this.categoryRepository.findOne({ where: { name } });

    if (!category) throw new BadRequestException('Category not found');

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return await this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: number) {
    return this.categoryRepository.delete(id);
  }

}

