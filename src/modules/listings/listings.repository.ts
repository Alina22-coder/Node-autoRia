import { AppDataSource } from "../../config/database.config";
import { ListingStatus } from "../../common/enums/listing-status.enum";
import { Listing } from "./entities/listing.entity";
import { ListingView } from "./entities/listing-view.entity";

interface ListingFilters {
    brandId?: number;
    modelId?: number;
    region?: string;
    minPrice?: number;
    maxPrice?: number;
}

class ListingRepository {
    private get repo() {
        return AppDataSource.getRepository(Listing);
    }

    private get viewRepo() {
        return AppDataSource.getRepository(ListingView);
    }

    public findAll(filters: ListingFilters): Promise<Listing[]> {
        const qb = this.repo
            .createQueryBuilder("listing")
            .leftJoinAndSelect("listing.brand", "brand")
            .leftJoinAndSelect("listing.model", "model")
            .leftJoinAndSelect("listing.user", "user")
            .where("listing.status = :status", { status: ListingStatus.ACTIVE });

        if (filters.brandId) qb.andWhere("brand.id = :brandId", { brandId: filters.brandId });
        if (filters.modelId) qb.andWhere("model.id = :modelId", { modelId: filters.modelId });
        if (filters.region)
            qb.andWhere("listing.region ILIKE :region", { region: `%${filters.region}%` });
        if (filters.minPrice) qb.andWhere("listing.priceUAH >= :min", { min: filters.minPrice });
        if (filters.maxPrice) qb.andWhere("listing.priceUAH <= :max", { max: filters.maxPrice });

        return qb.getMany();
    }

    public findById(id: number): Promise<Listing | null> {
        return this.repo.findOne({
            where: { id },
            relations: { brand: true, model: true, user: true },
        });
    }

    public findByUser(userId: number): Promise<Listing[]> {
        return this.repo.find({
            where: { user: { id: userId } },
            relations: { brand: true, model: true },
        });
    }

    public findByStatus(status: ListingStatus): Promise<Listing[]> {
        return this.repo.find({
            where: { status },
            relations: { brand: true, model: true, user: true },
        });
    }

    public countActiveByUser(userId: number): Promise<number> {
        return this.repo
            .createQueryBuilder("listing")
            .where("listing.user_id = :userId", { userId })
            .andWhere("listing.status = :status", { status: ListingStatus.ACTIVE })
            .getCount();
    }

    public create(data: Partial<Listing>): Listing {
        return this.repo.create(data);
    }

    public save(listing: Listing): Promise<Listing> {
        return this.repo.save(listing);
    }

    public remove(listing: Listing): Promise<Listing> {
        return this.repo.remove(listing);
    }

    public addView(listing: Listing): Promise<ListingView> {
        const view = this.viewRepo.create({ listing });
        return this.viewRepo.save(view);
    }
}

export const listingRepository = new ListingRepository();
