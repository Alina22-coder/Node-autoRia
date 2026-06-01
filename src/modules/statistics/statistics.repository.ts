import { AppDataSource } from "../../config/database.config";
import { ListingStatus } from "../../common/enums/listing-status.enum";
import { ListingView } from "../listings/entities/listing-view.entity";
import { Listing } from "../listings/entities/listing.entity";

class StatisticsRepository {
    private get viewRepo() {
        return AppDataSource.getRepository(ListingView);
    }

    private get listingRepo() {
        return AppDataSource.getRepository(Listing);
    }

    public findListingWithUser(id: number): Promise<Listing | null> {
        return this.listingRepo.findOne({
            where: { id },
            relations: { user: true },
        });
    }

    public countViews(listingId: number): Promise<number> {
        return this.viewRepo
            .createQueryBuilder("v")
            .where("v.listing_id = :id", { id: listingId })
            .getCount();
    }

    public countViewsSince(listingId: number, since: Date): Promise<number> {
        return this.viewRepo
            .createQueryBuilder("v")
            .where("v.listing_id = :id AND v.viewedAt >= :start", { id: listingId, start: since })
            .getCount();
    }

    public async getAveragePrices(scope: "region" | "ukraine", region?: string) {
        const qb = this.listingRepo
            .createQueryBuilder("listing")
            .select("AVG(listing.priceUAH)", "uah")
            .addSelect("AVG(listing.priceUSD)", "usd")
            .addSelect("AVG(listing.priceEUR)", "eur")
            .where("listing.status = :status", { status: ListingStatus.ACTIVE });

        if (scope === "region" && region) {
            qb.andWhere("listing.region ILIKE :region", { region: `%${region}%` });
        }

        const result = await qb.getRawOne();
        return {
            UAH: result?.uah ? Math.round(parseFloat(result.uah)) : 0,
            USD: result?.usd ? Math.round(parseFloat(result.usd)) : 0,
            EUR: result?.eur ? Math.round(parseFloat(result.eur)) : 0,
        };
    }
}

export const statisticsRepository = new StatisticsRepository();
