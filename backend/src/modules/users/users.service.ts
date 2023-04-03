import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UserRole } from "./entities/user-role.enum";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(dto: CreateUserDto) {
    const user = this.repo.create(dto);

    user.role = UserRole.USER;
    if (dto.isAdmin) {
      user.role = UserRole.ADMIN;
    }

    return this.repo.save(user);
  }

  async findOneById(id: number) {
    if (!id) {
      return null;
    }

    return await this.repo.findOne({ where: {id} });
  }

  async findOneByEmail(email: string) {
    if (!email) {
      throw new BadRequestException();
    }

    return await this.repo.findOne({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOneById(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number, user: any) {
    const result = await this.repo.softDelete(id);
    if (user.id !== id) {
      throw new ForbiddenException('You do not have permission to do this.');
    }

    if (result.affected === 0) {
      throw new NotFoundException('User not found.');
    }

    return true;
  }
}
