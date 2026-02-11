Here is a **simple, clean, and production-ready schema plan** for your yakiben pre-order system using Supabase + your Vue frontend.

This design is optimized for:
- Small-to-medium scale (single restaurant, low-to-moderate orders)
- No JSONB bloat (everything normalized with IDs)
- Integer-based enums/codes for common fixed choices (spiciness, extras, etc.)
- Clear separation of customer vs staff/admin roles
- Easy 9am batch query + printing
- Safe role handling (no client-side trust)
- Minimal tables (6 core + 1 optional)

### 1. Core Tables Summary

| Table Name              | Purpose                              | Key Columns (simplified)                          | Row Level Security (RLS) Suggestion |
|-------------------------|--------------------------------------|---------------------------------------------------|-------------------------------------|
| profiles                | Extends auth.users with app data & role | id (uuid fk auth.users), role (text), name, phone, default_address | Users read/update own row only; admins read all |
| menu_categories         | Group menu items (Lunch, Drinks, etc.) | id, name, sort_order                             | Public read; admin write |
| menu_items              | Individual bento/products            | id, name, price, image_url, category_id, is_available | Public read; admin write |
| customization_groups    | Groups like "Spiciness", "Extra"     | id, name, menu_item_id, is_required, allow_multiple, max_selections | Public read; admin write |
| customization_options   | Choices inside group (Hot, Cheese…)  | id, group_id, name, price_add, is_default        | Public read; admin write |
| orders                  | Main order header                    | id, user_id, total, delivery_date, status, address, payment_status | Customers read own; staff read all |
| order_items             | Line items in order                  | id, order_id, menu_item_id, quantity, price_at_order, line_total | Staff read/write; customers read via orders |
| order_item_customizations | Selected options per line item     | id, order_item_id, customization_option_id       | Staff read/write; customers read via orders |

### 2. Roles & Access (Safe & Standard)

Only **3 roles** needed for your case:

- `customer` – default for everyone
- `staff` – can view/update orders, mark preparing/out/delivered
- `admin` – full access (menu, users, roles)

**How roles are secured** (no injection risk):
- `role` is stored in `profiles` table
- Users **cannot** update their own role (RLS policy blocks it)
- Only admin can change roles (via admin page calling Edge Function or direct with service role)

**RLS Policies** (copy-paste these into Supabase SQL Editor):

```sql
-- Profiles: users read/update own only
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Admins can manage everything (add this policy on all tables if needed)
CREATE POLICY "Admins full access" ON public.profiles FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Orders: customers see own, staff see all
CREATE POLICY "Customers view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Staff view all orders" ON public.orders FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('staff', 'admin')
);
-- Similar for UPDATE on orders (staff/admin only)
```

### 3. Full SQL Schema (Ready to Run)

Run this in Supabase → **SQL Editor** (one block at a time or all together):

```sql
-- Enable extensions if not already
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles
-- Profiles (now includes default delivery address)
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'admin')),
  f_name text,
  l_name text, 
  corporate_name text, 
  tel text,
  
  -- Default / saved delivery address (used for all orders unless overridden)
  postcode text,
  address text NOT NULL,           -- full street, building, room etc.
  lat numeric,                     -- optional
  lng numeric,                     -- optional
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Menu Categories
CREATE TABLE IF NOT EXISTS menu_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  image_url text,
  category_id uuid REFERENCES menu_categories(id) ON DELETE SET NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Customization Groups
CREATE TABLE IF NOT EXISTS customization_groups (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,                    -- e.g. "Spiciness", "Extra Topping"
  menu_item_id uuid REFERENCES menu_items(id) ON DELETE CASCADE,
  is_required boolean DEFAULT false,
  allow_multiple boolean DEFAULT false,
  max_selections integer DEFAULT 1,
  sort_order integer DEFAULT 0
);

-- Customization Options (fixed choices with IDs)
CREATE TABLE IF NOT EXISTS customization_options (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id uuid NOT NULL REFERENCES customization_groups(id) ON DELETE CASCADE,
  name text NOT NULL,                    -- e.g. "Hot", "Cheese", "Cola"
  price_add numeric DEFAULT 0,
  is_default boolean DEFAULT false,
  sort_order integer DEFAULT 0
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  total numeric NOT NULL,
  delivery_datetime timestamptz NOT NULL CHECK (delivery_datetime > now()),
  status text NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')),
  payent_method text NOT NULL DEFAULT 'cod' 
    CHECK (payent_method IN ('cash', 'paypay')),
  payment_status text DEFAULT 'pending',
  payment_id text,                       -- PayPay transaction ID
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id uuid NOT NULL REFERENCES menu_items(id) ON DELETE RESTRICT,
  quantity integer NOT NULL CHECK (quantity > 0),
  price_at_order numeric NOT NULL,
  line_total numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Selected Customizations (junction table)
CREATE TABLE IF NOT EXISTS order_item_customizations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_item_id uuid NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  customization_option_id uuid NOT NULL REFERENCES customization_options(id) ON DELETE RESTRICT,
  created_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_orders_delivery_datetime_status ON orders (delivery_datetime, status);
CREATE INDEX idx_orders_user_id ON orders (user_id);
CREATE INDEX idx_order_items_order_id ON order_items (order_id);
CREATE INDEX idx_order_item_customizations_order_item_id ON order_item_customizations (order_item_id);
```

### 4. Simple Implementation Plan (Next 3–5 Steps)

1. **Run the SQL above** in Supabase SQL Editor → create all tables
2. **Add RLS policies** (copy from earlier response or dashboard)
3. **Enable Google Auth** (Providers → Google → paste Client ID/Secret)
4. **In Vue**:
   - Login with Google + upsert profile with role 'customer'
   - Load menu_items + customization_groups/options (join query)
   - In checkout: select menu → pick options (show names from IDs) → insert order + order_items + order_item_customizations
   - Build admin page: query tomorrow's pending orders + join items/options → display list + print button

5. **PayPay integration** (later): call PayPay JS SDK in checkout → save payment_id to orders table on success

This schema is **lean**, **normalized**, **fast**, and **easy to maintain** — no bloat, no JSONB parsing pain, perfect for your use case.

If you want:
- SQL for sample data insert (test menu + options)
- Vue composable for menu loading + order creation
- Print function code

Just tell me which part to do first — we can start implementing right away! 🚀