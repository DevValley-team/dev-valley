import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from "./entities/post.entity";
import { Category } from "./entities/category.entity";
import { CreatePostDto } from "./dtos/create-post.dto";
import { User } from "../users/entities/user.entity";
import { JwtTokenUserDto } from "../auth/dtos/jwt-token-user.dto";
import { UsersService } from "../users/users.service";

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private postRepo: Repository<Post>,
              @InjectRepository(Category) private categoryRepo: Repository<Category>,
              private readonly usersService: UsersService) {}

  async create(createPostDto: CreatePostDto, userId: number) {
    const { categoryId } = createPostDto;
    // TODO: categoryService 로 요청
    const category = await this.categoryRepo.findOne({ where: { id: categoryId } });

    if (!category) {
      throw new Error('Category not found');
    }

    const user = await this.usersService.findOneById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const post = this.postRepo.create(createPostDto);
    post.category = category;
    post.user = user;
    return this.postRepo.save(post);
  }

}
