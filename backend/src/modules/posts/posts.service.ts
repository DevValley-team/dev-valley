import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from "./entities/post.entity";
import { CreatePostDto } from "./dtos/request/create-post.dto";
import { UsersService } from "../users/users.service";
import { UpdatePostDto } from "./dtos/request/update-post.dto";
import { CategoriesService } from "../categories/categories.service";
import { GetPostsDto } from "./dtos/response/get-posts.dto";
import { CurrentUserDto } from "../../common/dtos/current-user.dto";
import { PostSummaryResponseDto } from "./dtos/response/post-summary-response.dto";
import { PageDto } from "../../common/dtos/page.dto";
import { CreatePostResponseDto } from "./dtos/response/create-post-response.dto";
import { plainToInstance } from "class-transformer";
import { PostLike } from "./entities/post-like.entity";
import { PostDetailsResponseDto } from "./dtos/response/post-details-response.dto";

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private postRepository: Repository<Post>,
              @InjectRepository(PostLike) private postLikeRepository: Repository<PostLike>,
              private readonly categoriesService: CategoriesService,
              private readonly usersService: UsersService) {}

  async create(createPostDto: CreatePostDto, currentUser: CurrentUserDto): Promise<CreatePostResponseDto> {
    const { categoryName } = createPostDto;
    const category = await this.categoriesService.findOneByNameOrThrow(categoryName);

    const user = await this.usersService.findOneByIdOrThrow(currentUser.id);

    const post = await this.postRepository.create(createPostDto);
    post.category = category;
    post.user = user;

    const savedPost = await this.postRepository.save(post);
    return plainToInstance(CreatePostResponseDto, savedPost, { strategy: 'excludeAll' });
  }

  async update(id: number, updatePostDto: UpdatePostDto, currentUser: CurrentUserDto) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user']
    });

    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');

    if (currentUser.id !== post.user.id) throw new ForbiddenException('접근권한이 없습니다.');

    // TODO: 카테고리 존재 유무 체크
    const updatedPost = Object.assign(post, updatePostDto);
    updatedPost.updatedAt = new Date();
    return await this.postRepository.save(updatedPost);
  }

  async softRemove(id: number, currentUser: CurrentUserDto): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user']
    });

    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');

    if (currentUser.id !== post.user.id) throw new ForbiddenException('접근권한이 없습니다.');

    await this.postRepository.softRemove(post)
      .catch(err => { throw new Error(err) });
  }

  async findOneByIdOrThrow(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');

    return post;
  }

  async getPostsByCategory(getPostsDto: GetPostsDto): Promise<PageDto<PostSummaryResponseDto>> {
    const { categoryName, page, limit } = getPostsDto;
    const offset = (page - 1) * limit;

    const [posts, totalPosts] = await this.postRepository.createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .where('post.category_name = :categoryName', { categoryName })
      .orderBy('post.id', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    const response = posts.map(post => new PostSummaryResponseDto(post));
    return new PageDto(response, page, limit, totalPosts);
  }

  async getPostDetails(id: number, currentUser: CurrentUserDto): Promise<PostDetailsResponseDto> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user']
    });

    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');

    // TODO: 고유 방문자
    await this.postRepository.increment({ id }, 'viewCount', 1);

    const responsePost = plainToInstance(PostDetailsResponseDto, post, { strategy: 'excludeAll' });

    if (currentUser) {
      responsePost['isAuthor'] = post.user.id === currentUser.id;

      const postLikeCount = await this.postLikeRepository.createQueryBuilder('postLike')
        .where('postLike.post_id = :postId', { postId: id })
        .andWhere('postLike.user_id = :userId', { userId: currentUser.id })
        .getCount();

      responsePost['isLiked'] = postLikeCount > 0;
    }

    return responsePost;
  }

  async likePost(id: number, currentUser: CurrentUserDto): Promise<{ postId: number }> {
    const post = await this.findOneByIdOrThrow(id);

    const postLikeCount = await this.postLikeRepository.createQueryBuilder('postLike')
      .where('postLike.post_id = :postId', { postId: id })
      .andWhere('postLike.user_id = :userId', { userId: currentUser.id })
      .getCount();

    if (postLikeCount > 0) throw new ConflictException('이미 좋아요를 눌렀습니다.');

    // user, currentUser userId 가 currentUser에 있으므로 적용하였음.
    const newPostLike = this.postLikeRepository.create({ post, user: currentUser });
    await this.postLikeRepository.save(newPostLike);

    await this.postRepository.increment({ id }, 'likeCount', 1);

    return { postId: id };
  }

  async unlikePost(id: number, currentUser: CurrentUserDto): Promise<{ postId: number }> {
    const postLike = await this.postLikeRepository
      .createQueryBuilder('postLike')
      .where('post_id = :postId', { postId: id })
      .andWhere('user_id = :userId', { userId: currentUser.id })
      .getOne();
    if (!postLike) throw new ConflictException('좋아요를 누르지 않았습니다.');
    await this.postLikeRepository.remove(postLike)
    await this.postRepository.decrement({ id }, 'likeCount', 1);
    return { postId: id };
  }

}
