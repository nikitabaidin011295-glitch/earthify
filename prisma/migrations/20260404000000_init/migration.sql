-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'starter',
    "modules_enabled" TEXT[],
    "settings" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_locations" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Kyiv',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tenant_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "specializations" TEXT[],
    "photo_url" TEXT,
    "commission_pct" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "schedule" JSONB NOT NULL DEFAULT '{}',
    "rating" DECIMAL(65,30) NOT NULL DEFAULT 5.0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guests" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT '',
    "birth_date" TIMESTAMP(3),
    "notes" TEXT NOT NULL DEFAULT '',
    "preferences" JSONB NOT NULL DEFAULT '{}',
    "allergens" TEXT[],
    "loyalty_points" INTEGER NOT NULL DEFAULT 0,
    "loyalty_level" TEXT NOT NULL DEFAULT 'bronze',
    "payment_token" TEXT,
    "telegram_chat_id" TEXT,
    "viber_user_id" TEXT,
    "instagram_id" TEXT,
    "facebook_id" TEXT,
    "tags" TEXT[],
    "last_visit_at" TIMESTAMP(3),
    "opt_out_sms" BOOLEAN NOT NULL DEFAULT false,
    "opt_out_all" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guest_visits" (
    "id" TEXT NOT NULL,
    "guest_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "notes" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "guest_visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "floor" INTEGER NOT NULL DEFAULT 1,
    "type" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 2,
    "price_base" DECIMAL(65,30) NOT NULL,
    "amenities" TEXT[],
    "photos" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'clean',
    "active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_bookings" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "guest_id" TEXT NOT NULL,
    "check_in" DATE NOT NULL,
    "check_out" DATE NOT NULL,
    "guests_count" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "channel" TEXT NOT NULL DEFAULT 'direct',
    "total_amount" DECIMAL(65,30) NOT NULL,
    "paid_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "payment_status" TEXT NOT NULL DEFAULT 'pending',
    "liqpay_order_id" TEXT,
    "liqpay_url" TEXT,
    "digital_key_token" TEXT,
    "digital_key_active" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT NOT NULL DEFAULT '',
    "pre_checkin_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "room_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_charges" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "room_charges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "duration_min" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "category" TEXT NOT NULL DEFAULT '',
    "photo_url" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resources" (
    "id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "guest_id" TEXT NOT NULL,
    "staff_id" TEXT,
    "resource_id" TEXT,
    "service_id" TEXT NOT NULL,
    "room_booking_id" TEXT,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "payment_status" TEXT NOT NULL DEFAULT 'pending',
    "liqpay_url" TEXT,
    "amount" DECIMAL(65,30) NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberships" (
    "id" TEXT NOT NULL,
    "guest_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "visits_total" INTEGER NOT NULL,
    "visits_used" INTEGER NOT NULL DEFAULT 0,
    "valid_from" DATE NOT NULL,
    "valid_until" DATE NOT NULL,
    "qr_token" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "amount_paid" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pool_sessions" (
    "id" TEXT NOT NULL,
    "membership_id" TEXT NOT NULL,
    "guest_id" TEXT NOT NULL,
    "slot_start" TIMESTAMP(3) NOT NULL,
    "slot_end" TIMESTAMP(3) NOT NULL,
    "locker_code" TEXT,
    "checked_in" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "pool_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tables" (
    "id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "zone" TEXT NOT NULL DEFAULT 'main',
    "qr_token" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'free',
    "active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "tables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "table_bookings" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "table_id" TEXT NOT NULL,
    "guest_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "time" TEXT NOT NULL,
    "guests_count" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "allergens" TEXT[],
    "notes" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "table_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_items" (
    "id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "price" DECIMAL(65,30) NOT NULL,
    "category" TEXT NOT NULL,
    "allergens" TEXT[],
    "available" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "table_id" TEXT,
    "guest_id" TEXT,
    "room_booking_id" TEXT,
    "items" JSONB NOT NULL,
    "subtotal" DECIMAL(65,30) NOT NULL,
    "tip" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "total" DECIMAL(65,30) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "payment_method" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "guest_id" TEXT,
    "location_id" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "discount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "loyalty_used" INTEGER NOT NULL DEFAULT 0,
    "method" TEXT NOT NULL,
    "liqpay_order_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_events" (
    "id" TEXT NOT NULL,
    "guest_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "loyalty_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "guest_id" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "is_auto" BOOLEAN NOT NULL DEFAULT false,
    "template_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "external_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "modules" TEXT[],
    "billing_cycle" TEXT NOT NULL DEFAULT 'monthly',
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'trialing',
    "trial_ends_at" TIMESTAMP(3),
    "current_period_end" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "guests_tenant_id_phone_key" ON "guests"("tenant_id", "phone");
CREATE UNIQUE INDEX "memberships_qr_token_key" ON "memberships"("qr_token");
CREATE UNIQUE INDEX "tables_qr_token_key" ON "tables"("qr_token");

-- AddForeignKey
ALTER TABLE "tenant_locations" ADD CONSTRAINT "tenant_locations_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "staff" ADD CONSTRAINT "staff_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "guests" ADD CONSTRAINT "guests_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "guest_visits" ADD CONSTRAINT "guest_visits_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "tenant_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "room_bookings" ADD CONSTRAINT "room_bookings_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "room_bookings" ADD CONSTRAINT "room_bookings_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "room_charges" ADD CONSTRAINT "room_charges_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "room_bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "room_charges" ADD CONSTRAINT "room_charges_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "services" ADD CONSTRAINT "services_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "resources" ADD CONSTRAINT "resources_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "tenant_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "resources"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_room_booking_id_fkey" FOREIGN KEY ("room_booking_id") REFERENCES "room_bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "pool_sessions" ADD CONSTRAINT "pool_sessions_membership_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "memberships"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "tables" ADD CONSTRAINT "tables_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "tenant_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "table_bookings" ADD CONSTRAINT "table_bookings_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "tables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "table_bookings" ADD CONSTRAINT "table_bookings_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "tenant_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "orders" ADD CONSTRAINT "orders_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "tables"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "orders" ADD CONSTRAINT "orders_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "orders" ADD CONSTRAINT "orders_room_booking_id_fkey" FOREIGN KEY ("room_booking_id") REFERENCES "room_bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "loyalty_events" ADD CONSTRAINT "loyalty_events_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "messages" ADD CONSTRAINT "messages_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "messages" ADD CONSTRAINT "messages_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
