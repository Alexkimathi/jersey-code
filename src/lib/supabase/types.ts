export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface TeamList {
  id: string;
  name: string;
  list_type: "epl" | "national" | "other";
  sort_order: number;
  created_at: string;
}

export type Sport = "football" | "rugby" | "basketball" | "cricket" | "formula_one" | "accessories";

export type FulfillmentMethod = "delivery" | "pickup";
export type PaymentMethod = "mpesa" | "pay_on_pickup" | "cash_on_delivery";
export type PaymentStatus = "pending" | "paid" | "failed" | "cancelled";
export type OrderStatus = "processing" | "ready" | "out_for_delivery" | "completed" | "cancelled";

export type AdminRole = "super_admin" | "admin";

export interface AdminUser {
  id: string;
  role: AdminRole;
  full_name: string | null;
  created_by: string | null;
  created_at: string;
}

export interface AdminPermissions {
  admin_id: string;
  can_create: boolean;
  can_edit: boolean;
  can_hide: boolean;
}

export interface Product {
  id: string;
  name: string;
  sport: Sport;
  team: string | null;
  description: string | null;
  price: number;
  image_url: string | null;
  back_image_url: string | null;
  side_image_url: string | null;
  badge_url: string | null;
  is_hidden: boolean;
  is_featured: boolean;
  is_clearance: boolean;
  sub_category: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  stock_quantity: number;
  sku: string | null;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  video_url: string | null;
  link_url: string | null;
  position: string;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Order {
  id: string;
  customer_name: string | null;
  customer_phone: string;
  customer_email: string | null;
  fulfillment_method: FulfillmentMethod;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  total_amount: number;
  mpesa_checkout_request_id: string | null;
  mpesa_merchant_request_id: string | null;
  delivery_address: Json | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  quantity: number;
  unit_price: number;
  custom_name: string | null;
  custom_number: string | null;
}

export interface AuditLog {
  id: string;
  admin_id: string | null;
  action: string;
  table_name: string;
  record_id: string | null;
  details: Json;
  created_at: string;
}

export type JerseyEdition = 'fan' | 'player';
export type JerseyBadge = string; // 'none' | 'champions_league' | 'league' | etc.

export interface JerseyCustomization {
  edition: JerseyEdition;
  printName?: string;
  printNumber?: string;
  font?: string;
  printColor?: string;
  badge: JerseyBadge;
  addOnPrice: number;
}

export interface CartItem {
  productId: string;
  variantId: string;
  /** Unique dedup key — includes customization so the same variant with different customizations is treated as separate cart items */
  cartKey?: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image_url: string | null;
  customization?: JerseyCustomization;
}

export interface CheckoutFormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  fulfillmentMethod: FulfillmentMethod;
  paymentMethod: PaymentMethod;
  deliveryAddress: {
    street: string;
    city: string;
    area: string;
  } | null;
}

export interface MpesaStkPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: AdminUser;
        Insert: Omit<AdminUser, "created_at">;
        Update: Partial<Omit<AdminUser, "created_at">>;
        Relationships: [];
      };
      admin_permissions: {
        Row: AdminPermissions;
        Insert: AdminPermissions;
        Update: Partial<AdminPermissions>;
        Relationships: [];
      };
      products: {
        Row: Product;
        Insert: Omit<Product, "created_at" | "updated_at">;
        Update: Partial<Omit<Product, "created_at" | "updated_at">>;
        Relationships: [];
      };
      product_variants: {
        Row: ProductVariant;
        Insert: Omit<ProductVariant, "id">;
        Update: Partial<ProductVariant>;
        Relationships: [];
      };
      banners: {
        Row: Banner;
        Insert: Omit<Banner, "created_at">;
        Update: Partial<Omit<Banner, "created_at">>;
        Relationships: [];
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "created_at">;
        Update: Partial<Omit<Order, "id" | "created_at">>;
        Relationships: [];
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, "id">;
        Update: Partial<OrderItem>;
        Relationships: [];
      };
      audit_log: {
        Row: AuditLog;
        Insert: Omit<AuditLog, "id" | "created_at">;
        Update: never;
        Relationships: [];
      };
      team_lists: {
        Row: TeamList;
        Insert: Omit<TeamList, "id" | "created_at">;
        Update: Partial<Omit<TeamList, "id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
