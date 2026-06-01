import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Listing } from "./listing.entity";

@Entity("listing_views")
export class ListingView {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Listing, (listing) => listing.views, { onDelete: "CASCADE" })
  @JoinColumn({ name: "listing_id" })
  listing: Listing;

  @CreateDateColumn()
  viewedAt: Date;
}
