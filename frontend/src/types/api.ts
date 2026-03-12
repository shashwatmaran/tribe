// API Response Types based on backend entities

export type InvoiceStatus = "PENDING" | "PAID" | "FAILED";
export type ChargeStatus = "PENDING" | "PAID" | "FAILED";
export type GroupStatus = "ACTIVE" | "INACTIVE";
export type MemberStatus = "ACTIVE" | "FAILED";
export type PaymentStatus = "SUCCESS" | "PAYMENT_FAILED" | "BLOCKED" | "PENDING";

export interface Group {
  id: string;
  platformGroupId: string;
  totalAmount: number; // in paise
  memberCount: number;
  currency: string;
  status: GroupStatus;
  createdAt: string;
}

export interface Member {
  id: string;
  groupId: string;
  email: string;
  status: MemberStatus;
  joinedAt: string;
}

export interface Invoice {
  id: string;
  groupId: string;
  totalAmount: number;
  status: InvoiceStatus;
  billingDate: string;
  createdAt: string;
}

export interface Charge {
  id: string;
  invoiceId: string;
  memberId: string;
  amount: number;
  status: ChargeStatus;
  createdAt: string;
}

// Request DTOs
export interface CreateGroupRequest {
  platformGroupId: string;
  totalAmount: number;
  memberCount: number;
  currency: string;
}

export interface AddMemberRequest {
  email: string;
}

// Composite types for UI
export interface GroupWithMembers extends Group {
  members: Member[];
}

export interface InvoiceWithCharges extends Invoice {
  charges: Charge[];
}

export interface MemberWithStatus extends Member {
  paymentStatus: PaymentStatus;
  amount?: number; // member's share of the cost
}

export interface BillingStatusData {
  groupId: string;
  groupName: string;
  status: PaymentStatus;
  totalAmount: number;
  memberCount: number;
  currency: string;
}

// Pagination
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

// Error Response
export interface ErrorResponse {
  message: string;
  code: string;
  timestamp: string;
}
