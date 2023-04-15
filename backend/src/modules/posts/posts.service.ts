import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from "./entities/post.entity";
import { CreatePostDto } from "./dtos/create-post.dto";
import { UsersService } from "../users/users.service";
import { UpdatePostDto } from "./dtos/update-post.dto";
import { CategoriesService } from "../categories/categories.service";
import { GetPostsDto } from "./dtos/get-posts.dto";
import { CurrentUserDto } from "../../common/dtos/current-user.dto";
import { PostListResponseDto } from "./dtos/responses/post-list-response.dto";
import { PostDetailsResponseDto } from "./dtos/responses/post-details-response.dto";

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private postRepository: Repository<Post>,
              private readonly categoriesService: CategoriesService,
              private readonly usersService: UsersService) {}

  async create(createPostDto: CreatePostDto, currentUser: CurrentUserDto): Promise<Post> {
    const { categoryId } = createPostDto;
    const category = await this.categoriesService.findOneById(categoryId);

    const user = await this.usersService.findOneById(currentUser.id);

    const post = await this.postRepository.create(createPostDto);
    post.category = category;
    post.user = user;

    return await this.postRepository.save(post);
  }

  async findOneById(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) throw new NotFoundException('Post not found');

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto, currentUser: CurrentUserDto): Promise<boolean> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user']
    });

    if (!post) throw new NotFoundException('Post not found.');

    if (currentUser.id !== post.user.id) throw new UnauthorizedException('You are not allowed to update this post.');

    const updatedPost = Object.assign(post, updatePostDto);
    const result = await this.postRepository.save(updatedPost);
    return !!result;
  }

  async softRemove(id: number, currentUser: CurrentUserDto): Promise<boolean> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user']
    });

    if (!post) throw new NotFoundException('Post not found.');

    if (currentUser.id !== post.user.id) throw new UnauthorizedException('You are not allowed to update this post.');

    const result = await this.postRepository.softRemove(post);
    return !!result;
  }

  async getPosts(getPostsDto: GetPostsDto): Promise<PostListResponseDto> {
    const { categoryId, page, limit } = getPostsDto;
    const offset = (page - 1) * limit;

    const [posts, totalPosts] = await this.postRepository.createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .where('post.category_id = :categoryId', { categoryId })
      .orderBy('post.id', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return new PostListResponseDto(posts, page, limit, totalPosts);
  }

  async getPostDetails(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user', 'category']
    });

    if (!post) throw new NotFoundException('Post not found');

    // TODO: 조회수 기능 추가

    return post
  }

}
