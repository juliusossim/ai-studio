import type { Address, GeoLocation, Money } from './common.types.js';
import type { Event } from './event.types.js';
import type { Media } from './media.types.js';

export type PropertyStatus = 'draft' | 'active' | 'under-offer' | 'sold' | 'archived';
export type PropertyMediaAttachmentRole = 'cover' | 'gallery';

export interface Property {
  id: string;
  title: string;
  description: string;
  location: GeoLocation;
  price: Money;
  media: Media[];
  status: PropertyStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyMediaAttachmentInput {
  mediaAssetId: string;
  alt: string;
  role?: PropertyMediaAttachmentRole;
}

export interface CreatePropertyRequest {
  title: string;
  description: string;
  location: Property['location'];
  price: Property['price'];
  media: PropertyMediaAttachmentInput[];
  status?: PropertyStatus;
}

export interface PropertyInteractionRequest {
  sessionId: string;
  userId?: string;
}

export interface PropertyInteractionResponse {
  property: Property;
  event: Event;
}

export type CanonicalPropertyStatus = 'draft' | 'active' | 'archived';
export type OwnershipSubjectType = 'user' | 'organization';
export type PropertyOwnershipRole = 'owner' | 'co_owner' | 'manager';
export type PropertyDocumentVerificationStatus =
  | 'pending'
  | 'in_review'
  | 'verified'
  | 'rejected'
  | 'expired';
export type ListingStatus =
  | 'draft'
  | 'review'
  | 'active'
  | 'paused'
  | 'under-offer'
  | 'sold'
  | 'archived';
export type ListingAssignmentActorType = 'user' | 'organization';
export type ListingAssignmentRole = 'owner' | 'agent' | 'creator' | 'agency' | 'manager';
export type ListingSuitabilityTag =
  | 'student_friendly'
  | 'couple_friendly'
  | 'working_professional_friendly'
  | 'family_friendly';
export type ListingOccupancyModel =
  | 'entire_unit'
  | 'room_only'
  | 'shared_unit'
  | 'landlord_on_site';
export type PaymentCadence =
  | 'one_time'
  | 'monthly'
  | 'quarterly'
  | 'biannual'
  | 'yearly'
  | 'milestone';
export type PaymentPlanType = 'upfront_only' | 'installments_allowed';
export type ListingCompletionState = 'ready_built' | 'off_plan' | 'under_construction';

export interface CanonicalProperty {
  id: string;
  title: string;
  description: string;
  status: CanonicalPropertyStatus;
  address?: Address;
  media: Media[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyOwnership {
  id: string;
  propertyId: string;
  ownerType: OwnershipSubjectType;
  ownerId: string;
  role: PropertyOwnershipRole;
  active: boolean;
  createdAt: Date;
}

export interface PropertyDocument {
  id: string;
  propertyId: string;
  kind: string;
  name: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyDocumentVerification {
  id: string;
  propertyDocumentId: string;
  status: PropertyDocumentVerificationStatus;
  verifier?: string;
  notes?: string;
  isCurrent: boolean;
  verifiedAt?: Date;
  createdAt: Date;
}

export interface Listing {
  id: string;
  propertyId: string;
  title: string;
  description: string;
  price: Money;
  status: ListingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListingAssignment {
  id: string;
  listingId: string;
  actorType: ListingAssignmentActorType;
  actorId: string;
  role: ListingAssignmentRole;
  active: boolean;
  createdAt: Date;
}

export interface ListingSuitabilityProfile {
  id: string;
  listingId: string;
  tags: ListingSuitabilityTag[];
  notes?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListingEligibilityPolicy {
  id: string;
  listingId: string;
  policyText: string;
  reviewStatus: PropertyDocumentVerificationStatus;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListingOccupancyProfile {
  id: string;
  listingId: string;
  occupancyModel: ListingOccupancyModel;
  landlordLivesOnSite: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListingPaymentTerms {
  id: string;
  listingId: string;
  completionState: ListingCompletionState;
  planType: PaymentPlanType;
  cadence: PaymentCadence;
  minimumUpfrontCycles: number;
  installmentCount?: number;
  deposit?: Money;
  notes?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
