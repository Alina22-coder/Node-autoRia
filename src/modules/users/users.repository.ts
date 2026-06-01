import { AppDataSource } from "../../config/database.config";
import { User } from "./entities/user.entity";

class UserRepository {
    private get repo() {
        return AppDataSource.getRepository(User);
    }

    public findAll(): Promise<User[]> {
        return this.repo.find();
    }

    public findById(id: number): Promise<User | null> {
        return this.repo.findOneBy({ id });
    }

    public findByEmail(email: string): Promise<User | null> {
        return this.repo.findOneBy({ email });
    }

    public create(data: Partial<User>): User {
        return this.repo.create(data);
    }

    public save(user: User): Promise<User> {
        return this.repo.save(user);
    }

    public remove(user: User): Promise<User> {
        return this.repo.remove(user);
    }
}

export const userRepository = new UserRepository();
