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

    const isCategoryExists = await this.categoryRepository.findOne({ where: { name: category.name } });
    if (isCategoryExists) throw new BadRequestException('카테고리가 이미 존재합니다.');

    return  await this.categoryRepository.save(category);
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findOneById(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) throw new BadRequestException('카테고리를 찾을 수 없습니다.');

    return category;
  }

  async findOneByName(name: string) {
    const category = await this.categoryRepository.findOne({ where: { name } });

    if (!category) throw new BadRequestException('카테고리를 찾을 수 없습니다.');

    return category;
  }

  async update(id: number, attrs: Partial<Category>) {
    const comment = await this.categoryRepository.findOne({ where: { id } });

    const updatedComment = Object.assign(comment, attrs);
    return await this.categoryRepository.save(updatedComment);
  }

  async remove(id: number) {
    return this.categoryRepository.delete(id);
  }

}

