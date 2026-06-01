import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { appConfig } from "../../config/app.config";
import { AccountType } from "../../common/enums/account-type.enum";
import { ApiError } from "../../common/errors/api.error";
import { Role } from "../../common/enums/role.enum";
import { authRepository } from "./auth.repository";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

class AuthService {
    public async register(dto: RegisterDto) {
        const existing = await authRepository.findByEmail(dto.email);
        if (existing) throw ApiError.conflict("Email already in use");

        const allowedRoles = [Role.BUYER, Role.SELLER];
        const role = allowedRoles.includes(dto.role as Role)
            ? (dto.role as Role)
            : Role.BUYER;

        const password = await bcrypt.hash(dto.password, 10);
        const user = await authRepository.create({
            ...dto,
            role,
            password,
            accountType: AccountType.BASIC,
        });

        const { password: _p, ...result } = user as typeof user & { password: string };
        return result;
    }

    public async login(dto: LoginDto) {
        const user = await authRepository.findByEmailWithPassword(dto.email);
        if (!user) throw ApiError.unauthorized("Invalid credentials");
        if (!user.isActive) throw ApiError.forbidden("Account is banned");

        const match = await bcrypt.compare(dto.password, (user as typeof user & { password: string }).password);
        if (!match) throw ApiError.unauthorized("Invalid credentials");

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, accountType: user.accountType },
            appConfig.jwt.secret,
            { expiresIn: appConfig.jwt.expiresIn } as jwt.SignOptions,
        );

        const { password: _p, ...userData } = user as typeof user & { password: string };
        return { token, user: userData };
    }
}

export const authService = new AuthService();
