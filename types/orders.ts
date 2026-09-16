/**
 * CHLPS Admin Portal & Student Checkout - Orders, Transactions & Financial Analytics Types
 * Endpoints: /api/v1/orders/*, /api/v1/transactions/*
 */

import { BaseEntity, PaginationQueryDto } from "./common";
import { Course } from "./courses";

export type OrderItemType = "course" | "membership";
export type PaymentStatus =
  | "pending"
  | "successful"
  | "failed"
  | "cancelled"
  | "refunded";
export type PaymentGateway = "paystack" | "stripe" | "bank_transfer" | "manual";

export interface OrderItem {
  id: string;
  itemType: OrderItemType;
  itemId: string;
  title: string;
  price: number;
  discount?: number;
}

export interface PaymentTransaction extends BaseEntity {
  trxRef: string;
  orderNumber: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentGateway: PaymentGateway;
  paidAt?: string | null;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  items: OrderItem[];
}

export interface OrderedItemDetail extends BaseEntity {
  orderNumber: string;
  itemType: OrderItemType;
  item: {
    id: string;
    title: string;
    price: number;
    coverImage?: string;
  };
  student: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  amount: number;
  currency: string;
  status: PaymentStatus;
  enrolledAt: string;
  progress?: number;
}

export interface CancelStudentOrderDto {
  orderNumber: string;
  reason?: string;
}

export interface StudentPurchasedCourse extends BaseEntity {
  course: {
    id: string;
    title: string;
    coverImage?: string;
  };
  purchaseDate: string;
  amount: number;
  progress: number;
  completed: boolean;
}

export interface MonthlyRevenueDataPoint {
  month: string;
  year: number;
  revenue: number;
  totalOrders: number;
}

export interface MonthlyRevenueResponse {
  data: MonthlyRevenueDataPoint[];
  totalAnnualRevenue: number;
}

export interface AdminAnalyticsResponse {
  totalRevenue: number;
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  totalMemberships: number;
  totalOrders: number;
  recentOrders: PaymentTransaction[];
  revenueByMonth: MonthlyRevenueDataPoint[];
}

export interface OrdersQueryDto extends PaginationQueryDto {
  status?: PaymentStatus;
  itemType?: OrderItemType;
  studentId?: string;
  startDate?: string;
  endDate?: string;
}

// ==========================================
// STUDENT CHECKOUT & PREVIEW TYPES
// ==========================================

export interface OrderItemInput {
  id: string;
  price: number;
  applicationId?: string;
  documentId?: string;
}

export interface OrderPreviewPayload {
  amount: number;
  courses?: OrderItemInput[];
  memberships?: OrderItemInput[];
}

export interface OrderPreviewCalculations {
  subAmount: number;
  taxAmount?: number;
  taxRate?: number;
  total: number;
  amount?: number;
  totalAmount?: number;
  discount?: number;
  currency?: string;
  courses?: Array<{
    id: string;
    title?: string;
    price: number;
  }>;
  memberships?: Array<{
    id: string;
    name?: string;
    price: number;
  }>;
}

export interface OrderCreatePayload {
  amount: number;
  callback_url: string;
  courses?: OrderItemInput[];
  memberships?: OrderItemInput[];
  currency?: string;
}

export interface OrderCreateResponseData {
  orderNumber?: string;
  orderId?: string;
  id?: string;
  amount?: number;
  subAmount?: number;
  taxAmount?: number;
  status?: string;
  reference: string;
  thirdPartyRef?: string;
  authorization_url?: string;
  authorizationUrl?: string;
  clientSecret?: string;
  paymentIntentId?: string;
  gateway?: "stripe" | "paystack";
}

export interface OrderConfirmResponseData {
  orderNumber?: string;
  reference?: string;
  status: string;
  message?: string;
}

export interface OrderTransactionDetail {
  id: string;
  reference?: string;
  status: string;
  amount: number;
  subAmount?: number;
  createdDate?: string;
}

export interface PurchasedOrderItem {
  id: string;
  price?: number;
  course?: Course | null;
  membership?: {
    id: string;
    name: string;
    slug?: string;
  } | null;
}

export interface LiveOrderRecord {
  id: string;
  number: string;
  status: string;
  createdDate: string;
  trx?: OrderTransactionDetail;
  orderItems?: PurchasedOrderItem[];
}
