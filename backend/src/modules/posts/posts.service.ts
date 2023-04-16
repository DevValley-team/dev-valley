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
import { PostSummaryResponseDto } from "./dtos/response/post-summary-response.dto";
import { PageDto } from "../../common/dtos/page.dto";

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private postRepository: Repository<Post>,
              private readonly categoriesService: CategoriesService,
              private readonly usersService: UsersService) {}

  async createPost(createPostDto: CreatePostDto, currentUser: CurrentUserDto) {
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

    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');

    return post;
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto, currentUser: CurrentUserDto) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user']
    });

    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');

    if (currentUser.id !== post.user.id) throw new UnauthorizedException('접근권한이 없습니다.');

    const updatedPost = Object.assign(post, updatePostDto);
    return await this.postRepository.save(updatedPost);
  }

  async softRemovePost(id: number, currentUser: CurrentUserDto) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user']
    });

    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');

    if (currentUser.id !== post.user.id) throw new UnauthorizedException('접근권한이 없습니다.');

    return !!await this.postRepository.softRemove(post);
  }

  async getPostsByCategory(getPostsDto: GetPostsDto): Promise<PageDto<PostSummaryResponseDto>> {
    const { categoryId, page, limit } = getPostsDto;
    const offset = (page - 1) * limit;

    const [posts, totalPosts] = await this.postRepository.createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .where('post.category_id = :categoryId', { categoryId })
      .orderBy('post.id', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    const response = posts.map(post => new PostSummaryResponseDto(post));
    return new PageDto(response, page, limit, totalPosts);
  }

  async getPostDetails(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user', 'category']
    });

    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');

    // TODO: 조회수 기능 추가

    return post
  }

}
