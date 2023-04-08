import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from "./entities/post.entity";
import { Category } from "../categories/entities/category.entity";
import { CreatePostDto } from "./dtos/create-post.dto";
import { User } from "../users/entities/user.entity";
import { JwtTokenUserDto } from "../auth/dtos/jwt-token-user.dto";
import { UsersService } from "../users/users.service";
import { UpdateUserDto } from "../users/dtos/update-user.dto";
import { UpdatePostDto } from "./dtos/update-post.dto";
import { CategoriesService } from "../categories/categories.service";
import { GetPostsDto } from "./dtos/get-posts.dto";

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private postRepository: Repository<Post>,
              private readonly categoriesService: CategoriesService,
              private readonly usersService: UsersService) {}

  async create(createPostDto: CreatePostDto, userId: number) {
    const { categoryId } = createPostDto;
    const category = await this.categoriesService.findOneById(categoryId);

    const user = await this.usersService.findOneById(userId);

    const post = this.postRepository.create(createPostDto);
    post.category = category;
    post.user = user;

    return this.postRepository.save(post);
  }

  async getPosts(getPostsDto: GetPostsDto) {
    const { categoryId, page, limit } = getPostsDto;
    const offset = (page - 1) * limit;

    const posts = await this.postRepository.createQueryBuilder()
      .where('category_id = :categoryId', { categoryId })
      .orderBy('id', 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();

    const totalPosts = await this.postRepository.createQueryBuilder('post')
      .where('post.category_id = :categoryId', { categoryId })
      .getCount();

    return {
      data: posts,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalPosts / limit),
    };
  }

  async findOneById(id: number) {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) throw new Error('Post not found');

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    return await this.postRepository.update(id, updatePostDto);
  }

  async remove(id: number) {
    return this.postRepository.softDelete(id);
  }

}
