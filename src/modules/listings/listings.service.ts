import { AccountType } from "../../common/enums/account-type.enum";
import { ApiError } from "../../common/errors/api.error";
import { ListingStatus } from "../../common/enums/listing-status.enum";
import { Role } from "../../common/enums/role.enum";
import { appConfig } from "../../config/app.config";
import { carRepository } from "../cars/cars.repository";
import { convertPrice } from "../currency/currency.service";
import { notificationService } from "../notifications/notifications.service";
import { profanityService } from "../profanity/profanity.service";
import { userRepository } from "../users/users.repository";
import { CreateListingDto } from "./dto/create-listing.dto";
import { UpdateListingDto } from "./dto/update-listing.dto";
import { listingRepository } from "./listings.repository";

const MAX_EDIT_ATTEMPTS = 3;

class ListingService {
    public getAll(filters: {
        brandId?: number;
        modelId?: number;
        region?: string;
        minPrice?: number;
        maxPrice?: number;
    }) {
        return listingRepository.findAll(filters);
    }

    public async getById(id: number) {
        const listing = await listingRepository.findById(id);
        if (!listing) throw ApiError.notFound("Listing not found");
        await listingRepository.addView(listing);
        return listing;
    }

    public getMyListings(userId: number) {
        return listingRepository.findByUser(userId);
    }

    public getPendingListings() {
        return listingRepository.findByStatus(ListingStatus.PENDING);
    }

    public async create(userId: number, dto: CreateListingDto) {
        const user = await userRepository.findById(userId);
        if (!user) throw ApiError.notFound("User not found");

        if (user.accountType === AccountType.BASIC) {
            const count = await listingRepository.countActiveByUser(userId);
            if (count >= 1) throw ApiError.badRequest("Basic account allows only 1 active listing");
        }

        const brand = await carRepository.findBrandById(dto.brandId);
        if (!brand) throw ApiError.notFound("Brand not found");

        const model = await carRepository.findModelById(dto.modelId);
        if (!model) throw ApiError.notFound("Model not found");

        const hasProfanity =
            profanityService.check(dto.title) || profanityService.check(dto.description);
        const prices = await convertPrice(dto.price, dto.currency);

        const listing = listingRepository.create({
            ...dto,
            brand,
            model,
            user,
            ...prices,
            status: hasProfanity ? ListingStatus.PENDING : ListingStatus.ACTIVE,
        });

        await listingRepository.save(listing);
        return { listing, hasProfanity };
    }

    public async update(listingId: number, userId: number, userRole: Role, dto: UpdateListingDto) {
        const listing = await listingRepository.findById(listingId);
        if (!listing) throw ApiError.notFound("Listing not found");

        const isOwner = listing.user.id === userId;
        const isManagerOrAdmin = [Role.MANAGER, Role.ADMIN].includes(userRole);
        if (!isOwner && !isManagerOrAdmin) throw ApiError.forbidden();

        if (isOwner && listing.status === ListingStatus.INACTIVE) {
            throw ApiError.badRequest("Listing is inactive and cannot be edited");
        }

        if (isOwner) {
            listing.editCount += 1;
            if (listing.editCount > MAX_EDIT_ATTEMPTS) {
                listing.status = ListingStatus.INACTIVE;
                await listingRepository.save(listing);
                await this.notifyManager(listing);
                throw ApiError.badRequest("Max edit attempts reached. Listing is now inactive.");
            }
        }

        Object.assign(listing, dto);

        if (dto.price && dto.currency) {
            const prices = await convertPrice(dto.price, dto.currency);
            Object.assign(listing, prices);
        }

        const hasProfanity = profanityService.check(`${listing.title} ${listing.description}`);

        if (hasProfanity) {
            if (isOwner && listing.editCount >= MAX_EDIT_ATTEMPTS) {
                listing.status = ListingStatus.INACTIVE;
                await listingRepository.save(listing);
                await this.notifyManager(listing);
                throw ApiError.badRequest(
                    "Profanity detected. Max attempts reached. Listing is inactive.",
                );
            }
            await listingRepository.save(listing);
            return { listing, hasProfanity: true };
        }

        listing.status = ListingStatus.ACTIVE;
        await listingRepository.save(listing);
        return { listing, hasProfanity: false };
    }

    public async deleteListing(listingId: number, userId: number, userRole: Role) {
        const listing = await listingRepository.findById(listingId);
        if (!listing) throw ApiError.notFound("Listing not found");

        const isOwner = listing.user.id === userId;
        const isManagerOrAdmin = [Role.MANAGER, Role.ADMIN].includes(userRole);
        if (!isOwner && !isManagerOrAdmin) throw ApiError.forbidden();

        await listingRepository.remove(listing);
    }

    public async activateListing(listingId: number) {
        const listing = await listingRepository.findById(listingId);
        if (!listing) throw ApiError.notFound("Listing not found");
        listing.status = ListingStatus.ACTIVE;
        return listingRepository.save(listing);
    }

    public async deactivateListing(listingId: number) {
        const listing = await listingRepository.findById(listingId);
        if (!listing) throw ApiError.notFound("Listing not found");
        listing.status = ListingStatus.INACTIVE;
        return listingRepository.save(listing);
    }

    private async notifyManager(listing: { id: number; title: string }) {
        await notificationService.send({
            to: appConfig.mail.from,
            subject: "Listing requires manual review",
            text: `Listing ID ${listing.id} ("${listing.title}") failed profanity check after ${MAX_EDIT_ATTEMPTS} attempts.`,
        });
    }
}

export const listingService = new ListingService();
