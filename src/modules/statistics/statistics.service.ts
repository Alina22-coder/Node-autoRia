import { ApiError } from "../../common/errors/api.error";
import { statisticsRepository } from "./statistics.repository";

class StatisticsService {
    public async getListingStats(listingId: number, userId: number) {
        const listing = await statisticsRepository.findListingWithUser(listingId);
        if (!listing) throw ApiError.notFound("Listing not found");
        if (listing.user.id !== userId) throw ApiError.forbidden();

        const now = new Date();

        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - 7);

        const startOfMonth = new Date(now);
        startOfMonth.setDate(now.getDate() - 30);

        const [total, day, week, month, avgByRegion, avgUkraine] = await Promise.all([
            statisticsRepository.countViews(listingId),
            statisticsRepository.countViewsSince(listingId, startOfDay),
            statisticsRepository.countViewsSince(listingId, startOfWeek),
            statisticsRepository.countViewsSince(listingId, startOfMonth),
            statisticsRepository.getAveragePrices("region", listing.region),
            statisticsRepository.getAveragePrices("ukraine"),
        ]);

        return {
            views: { total, day, week, month },
            avgPriceRegion: { ...avgByRegion, region: listing.region },
            avgPriceUkraine: avgUkraine,
        };
    }
}

export const statisticsService = new StatisticsService();
