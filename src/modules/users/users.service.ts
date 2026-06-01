import bcrypt from "bcryptjs";

import { AccountType } from "../../common/enums/account-type.enum";
import { ApiError } from "../../common/errors/api.error";
import { Role } from "../../common/enums/role.enum";
import { userRepository } from "./users.repository";

interface CreateManagerDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

class UserService {
    public findAll() {
        return userRepository.findAll();
    }

    public async findById(id: number) {
        const user = await userRepository.findById(id);
        if (!user) throw ApiError.notFound("User not found");
        return user;
    }

    public async createManager(dto: CreateManagerDto) {
        const existing = await userRepository.findByEmail(dto.email);
        if (existing) throw ApiError.conflict("Email already in use");

        const password = await bcrypt.hash(dto.password, 10);
        const user = userRepository.create({
            ...dto,
            password,
            role: Role.MANAGER,
            accountType: AccountType.BASIC,
        });

        const saved = await userRepository.save(user);
        const { password: _p, ...result } = saved as typeof saved & { password: string };
        return result;
    }

    public async upgradeAccount(userId: number) {
        const user = await this.findById(userId);
        if (user.accountType === AccountType.PREMIUM) {
            throw ApiError.conflict("Account is already Premium");
        }
        user.accountType = AccountType.PREMIUM;
        return userRepository.save(user);
    }

    public async banUser(userId: number) {
        const user = await this.findById(userId);
        user.isActive = false;
        return userRepository.save(user);
    }

    public async unbanUser(userId: number) {
        const user = await this.findById(userId);
        user.isActive = true;
        return userRepository.save(user);
    }

    public async deleteUser(userId: number) {
        const user = await this.findById(userId);
        return userRepository.remove(user);
    }
}

export const userService = new UserService();
