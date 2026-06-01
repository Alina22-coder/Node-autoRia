import { NextFunction, Request, Response } from "express";

import { AuthRequest } from "../../common/middlewares/auth.middleware";
import { parseId } from "../../common/helpers/params.helper";
import { Role } from "../../common/enums/role.enum";
import { listingService } from "./listings.service";

class ListingController {
    public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { brandId, modelId, region, minPrice, maxPrice } = req.query;
            const data = await listingService.getAll({
                brandId: brandId ? parseInt(brandId as string) : undefined,
                modelId: modelId ? parseInt(modelId as string) : undefined,
                region: region as string | undefined,
                minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
                maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
            });
            res.status(200).json({ status: 200, data });
        } catch (err) {
            next(err);
        }
    }

    public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await listingService.getById(parseId(req.params.id));
            res.status(200).json({ status: 200, data });
        } catch (err) {
            next(err);
        }
    }

    public async getMyListings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await listingService.getMyListings(req.user!.id);
            res.status(200).json({ status: 200, data });
        } catch (err) {
            next(err);
        }
    }

    public async getPending(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await listingService.getPendingListings();
            res.status(200).json({ status: 200, data });
        } catch (err) {
            next(err);
        }
    }

    public async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await listingService.create(req.user!.id, req.body);
            const message = result.hasProfanity
                ? "Listing created but contains suspicious content. Please edit."
                : "Listing created successfully";
            res.status(201).json({ status: 201, message, data: result.listing });
        } catch (err) {
            next(err);
        }
    }

    public async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await listingService.update(
                parseId(req.params.id),
                req.user!.id,
                req.user!.role as Role,
                req.body,
            );
            const message = result.hasProfanity
                ? "Listing updated but still contains suspicious content."
                : "Listing updated successfully";
            res.status(200).json({ status: 200, message, data: result.listing });
        } catch (err) {
            next(err);
        }
    }

    public async deleteListing(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            await listingService.deleteListing(
                parseId(req.params.id),
                req.user!.id,
                req.user!.role as Role,
            );
            res.status(200).json({ status: 200, message: "Listing deleted" });
        } catch (err) {
            next(err);
        }
    }

    public async activateListing(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await listingService.activateListing(parseId(req.params.id));
            res.status(200).json({ status: 200, message: "Listing activated", data });
        } catch (err) {
            next(err);
        }
    }

    public async deactivateListing(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await listingService.deactivateListing(parseId(req.params.id));
            res.status(200).json({ status: 200, message: "Listing deactivated", data });
        } catch (err) {
            next(err);
        }
    }
}

export const listingController = new ListingController();
