import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UserRole } from "./entities/user-role.enum";
import { CurrentUserDto } from "../../common/dtos/current-user.dto";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.usersRepo.create(dto);

    if (dto.isAdmin) {
      user.role = UserRole.ADMIN;
    }
    user.role = UserRole.USER;

    return await this.usersRepo.save(user);
  }

  async findOneById(id: number): Promise<User> {
    if (!id) return null;

    const user = await this.usersRepo.findOne({ where: {id} });

    if (!user) throw new NotFoundException('User not found.');

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    if (!email) throw new BadRequestException();

    const user = await this.usersRepo.findOne({ where: { email } });

    if (!user) throw new NotFoundException('User not found.');

    return user;
  }

  async update(id: number, attrs: Partial<User>): Promise<User> {
    const user = await this.findOneById(id);

    if (!user) throw new NotFoundException('User not found.');

    Object.assign(user, attrs);
    return this.usersRepo.save(user);
  }

  async remove(id: number, currentUser: CurrentUserDto): Promise<boolean> {
    if (currentUser.id !== id) throw new ForbiddenException('You do not have permission to do this.');

    const result = await this.usersRepo.softDelete(id);

    if (result.affected === 0) throw new NotFoundException('User not found.');

    return true;
  }

  async updateLastLogInAt(user: User): Promise<void> {
    await this.usersRepo.update(user.id, { lastLogInAt: new Date() });
  }

  async isEmailTaken(email: string): Promise<boolean> {
    const user = await this.usersRepo.findOne({ where: { email } });
    return !!user;
  }
}
