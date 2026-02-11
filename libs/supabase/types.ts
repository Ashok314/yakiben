export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: string;
          f_name: string | null;
          l_name: string | null;
          corporate_name: string | null;
          tel: string | null;
          postcode: string | null;
          address: string;
          lat: number | null;
          lng: number | null;
          created_at: string | null;
          updated_at: string | null;
          deleted_at: string | null;
        };
        Insert: {
          id: string;
          role?: string;
          f_name?: string | null;
          l_name?: string | null;
          corporate_name?: string | null;
          tel?: string | null;
          postcode?: string | null;
          address: string;
          lat?: number | null;
          lng?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          role?: string;
          f_name?: string | null;
          l_name?: string | null;
          corporate_name?: string | null;
          tel?: string | null;
          postcode?: string | null;
          address?: string;
          lat?: number | null;
          lng?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
          deleted_at?: string | null;
        };
      };
      menu_categories: {
        Row: {
          id: string;
          name: string;
          sort_order: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          sort_order?: number | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          sort_order?: number | null;
          created_at?: string | null;
        };
      };
      menu_items: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          image_url: string | null;
          category_id: string | null;
          is_available: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          category_id?: string | null;
          is_available?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          image_url?: string | null;
          category_id?: string | null;
          is_available?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          tracking_id: string;
          total: number;
          delivery_datetime: string;
          status: string;
          payment_method: string;
          payment_status: string | null;
          payment_id: string | null;
          notes: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          tracking_id: string;
          total: number;
          delivery_datetime: string;
          status?: string;
          payment_method?: string;
          payment_status?: string | null;
          payment_id?: string | null;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          tracking_id?: string;
          total?: number;
          delivery_datetime?: string;
          status?: string;
          payment_method?: string;
          payment_status?: string | null;
          payment_id?: string | null;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          menu_item_id: string;
          quantity: number;
          price_at_order: number;
          line_total: number;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          order_id: string;
          menu_item_id: string;
          quantity: number;
          price_at_order: number;
          line_total: number;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          order_id?: string;
          menu_item_id?: string;
          quantity?: number;
          price_at_order?: number;
          line_total?: number;
          created_at?: string | null;
        };
      };
      customization_groups: {
        Row: {
          id: string;
          name: string;
          menu_item_id: string | null;
          is_required: boolean | null;
          allow_multiple: boolean | null;
          max_selections: number | null;
          sort_order: number | null;
        };
        Insert: {
          id?: string;
          name: string;
          menu_item_id?: string | null;
          is_required?: boolean | null;
          allow_multiple?: boolean | null;
          max_selections?: number | null;
          sort_order?: number | null;
        };
        Update: {
          id?: string;
          name?: string;
          menu_item_id?: string | null;
          is_required?: boolean | null;
          allow_multiple?: boolean | null;
          max_selections?: number | null;
          sort_order?: number | null;
        };
      };
      customization_options: {
        Row: {
          id: string;
          group_id: string;
          name: string;
          price_add: number | null;
          is_default: boolean | null;
          sort_order: number | null;
        };
        Insert: {
          id?: string;
          group_id: string;
          name: string;
          price_add?: number | null;
          is_default?: boolean | null;
          sort_order?: number | null;
        };
        Update: {
          id?: string;
          group_id?: string;
          name?: string;
          price_add?: number | null;
          is_default?: boolean | null;
          sort_order?: number | null;
        };
      };
    };
    Views: {
      admin_users_view: {
        Row: {
          id: string;
          role: string;
          f_name: string | null;
          l_name: string | null;
          full_name_meta: string | null;
          tel: string | null;
          address: string | null;
          created_at: string | null;
          deleted_at: string | null;
          email: string | null;
        };
      };
      orders_with_customer: {
        Row: {
          id: string;
          tracking_id: string;
          user_id: string;
          status: string;
          total: number;
          payment_method: string;
          payment_status: string | null;
          delivery_datetime: string;
          notes: string | null;
          created_at: string | null;
          updated_at: string | null;
          customer_f_name: string | null;
          customer_l_name: string | null;
          customer_tel: string | null;
          customer_address: string | null;
          customer_postcode: string | null;
          customer_company: string | null;
        };
      };
    };
    Functions: {
      is_admin_or_manager: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
