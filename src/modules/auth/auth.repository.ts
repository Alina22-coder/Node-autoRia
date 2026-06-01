import { AppDataSource } from "../../config/database.config";
import { User } from "../users/entities/user.entity";
import { RegisterDto } from "./dto/register.dto";

class AuthRepository {
    private get repo() {
        return AppDataSource.getRepository(User);
    }

    public findByEmail(email: string): Promise<User | null> {
        return this.repo.findOneBy({ email });
    }

    public findByEmailWithPassword(email: string): Promise<User | null> {
        return this.repo
            .createQueryBuilder("user")
            .addSelect("user.password")
            .where("user.email = :email", { email })
            .getOne();
    }

    public async create(dto: RegisterDto & { password: string }): Promise<User> {
        const user = this.repo.create(dto as unknown as User);
        return this.repo.save(user);
    }
}

export const authRepository = new AuthRepository();
