import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UserRole } from "./entities/user-role.enum";
import { CurrentUserDto } from "../../common/dtos/current-user.dto";
import { AuthUser } from "./entities/auth-user.entity";
import { plainToInstance } from "class-transformer";
import { UserResponseDto } from "./dtos/response/user-response.dto";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>,
              @InjectRepository(AuthUser) private authUserRepository: Repository<AuthUser>) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(dto);
    user.role = UserRole.GUEST;

    return await this.userRepository.manager.transaction(async (entityManager: EntityManager) => {
      const savedUser = await entityManager.save(user);
      const newAuthUser = this.authUserRepository.create({ user: savedUser });
      await entityManager.save(newAuthUser);
      return savedUser;
    });
  }

  async update(id: number, attrs: Partial<User>): Promise<User> {
    const user = await this.findOneByIdOrThrow(id);

    const updatedUser = Object.assign(user, attrs);
    updatedUser.updatedAt = new Date();
    return this.userRepository.save(updatedUser);
  }

  async updateLastLoginAt(user: User): Promise<void> {
    await this.userRepository.update(user.id, { lastLoginAt: new Date() });
  }

  async updateRole(id: number, role: UserRole) {
    return await this.userRepository.update(id, {
      role,
      updatedAt: new Date()
    });
  }

  async remove(id: number, currentUser: CurrentUserDto) {
    if (currentUser.id !== id) throw new ForbiddenException('접근권한이 없습니다.');

    const user = await this.findOneByIdOrThrow(id);

    const result = await this.userRepository.softRemove(user);
  }

  async getUserDetails(currentUser: CurrentUserDto) {
    const { id } = currentUser;

    const user = await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.authUser', 'authUser')
      .where('user.id = :id', { id })
      .getOne();

    return plainToInstance(UserResponseDto, user, { strategy: 'excludeAll' });
  }

  async findOneByIdOrThrow(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다.');

    return user;
  }

  async findOneByEmailOrThrow(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다.');

    return user;
  }

  // TODO: 이 함수들은 Repository 계층이 더 적합하려나..?
  async isEmailExists(email: string): Promise<boolean> {
    return 0 < await this.userRepository.count({ where: { email } });
  }

  async isNicknameExists(nickname: string): Promise<boolean> {
    return 0 < await this.userRepository.count({ where: { nickname } });
  }
}
