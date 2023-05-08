import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./entities/category.entity";
import { CreateCategoryDto } from "./dtos/create-category.dto";
import { UpdateCategoryDto } from "./dtos/update-category.dto";
import { CurrentUserDto } from "../../common/dtos/current-user.dto";

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);

    if (await this.isCategoryExists(category.name))
      throw new BadRequestException('카테고리가 이미 존재합니다.');

    return  await this.categoryRepository.save(category);
  }

  async update(id: number, attrs: Partial<Category>) {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) throw new NotFoundException('카테고리를 찾을 수 없습니다.');

    const updatedComment = Object.assign(category, attrs);
    return await this.categoryRepository.save(updatedComment);
  }

  async remove(id: number) {
    return this.categoryRepository.delete(id);
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findOneByIdOrThrow(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) throw new BadRequestException('카테고리를 찾을 수 없습니다.');

    return category;
  }

  async findOneByNameOrThrow(name: string) {
    const category = await this.categoryRepository.findOne({ where: { name } });

    if (!category) throw new BadRequestException('카테고리를 찾을 수 없습니다.');

    return category;
  }

  async isCategoryExists(name: string): Promise<boolean> {
    return 0 < await this.categoryRepository.count({ where: { name } });
  }

}

