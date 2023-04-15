import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UserRole } from "./entities/user-role.enum";
import { CurrentUserDto } from "../../common/dtos/current-user.dto";
import { AuthUser } from "./entities/auth-user.entity";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>,
              @InjectRepository(AuthUser) private authUserRepository: Repository<AuthUser>) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(dto);

    // TODO: admin 인증 로직 강화
    if (dto.isAdmin) {
      user.role = UserRole.ADMIN;
    } else {
      user.role = UserRole.GUEST;
    }

    return await this.userRepository.manager.transaction(async (entityManager: EntityManager) => {
      const savedUser = await entityManager.save(user);
      const newAuthUser = this.authUserRepository.create({ user: savedUser });
      await entityManager.save(newAuthUser);
      return savedUser;
    });
  }

  async findOneById(id: number): Promise<User> {
    if (!id) return null;

    const user = await this.userRepository.findOne({ where: {id} });

    if (!user) throw new NotFoundException('User not found.');

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    if (!email) throw new BadRequestException();

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new NotFoundException('User not found.');

    return user;
  }

  async update(id: number, attrs: Partial<User>): Promise<User> {
    const user = await this.findOneById(id);

    if (!user) throw new NotFoundException('User not found.');

    Object.assign(user, attrs);
    return this.userRepository.save(user);
  }

  async remove(id: number, currentUser: CurrentUserDto): Promise<boolean> {
    if (currentUser.id !== id) throw new ForbiddenException('You do not have permission to do this.');

    const result = await this.userRepository.softDelete(id);

    if (result.affected === 0) throw new NotFoundException('User not found.');

    return true;
  }

  async updateLastLogInAt(user: User): Promise<void> {
    await this.userRepository.update(user.id, { lastLogInAt: new Date() });
  }

  async isEmailExists(email: string): Promise<boolean> {
    return !!await this.userRepository.findOne({ where: { email } });
  }

  async updateRole(id: number, role: UserRole) {
    return await this.userRepository.update(id, { role });
  }
}
