-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "reset_token" VARCHAR(255),
    "reset_token_expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_items" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "category_id" UUID NOT NULL,
    "media_type" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "media_url" TEXT NOT NULL,
    "media_public_id" VARCHAR(255),
    "video_url" TEXT,
    "video_embed_url" TEXT,
    "description" TEXT,
    "release_date" VARCHAR(50),
    "external_link" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolio_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "role_title" VARCHAR(150) NOT NULL,
    "division_id" VARCHAR(50) NOT NULL,
    "photo_url" TEXT NOT NULL,
    "photo_public_id" VARCHAR(255),
    "avatar_url" TEXT,
    "avatar_public_id" VARCHAR(255),
    "quote_text" TEXT,
    "instagram_url" VARCHAR(255),
    "is_leader" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "key" VARCHAR(50) NOT NULL,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_items_slug_key" ON "portfolio_items"("slug");

-- CreateIndex
CREATE INDEX "portfolio_items_category_id_idx" ON "portfolio_items"("category_id");

-- CreateIndex
CREATE INDEX "portfolio_items_is_featured_idx" ON "portfolio_items"("is_featured");

-- CreateIndex
CREATE INDEX "team_members_division_id_idx" ON "team_members"("division_id");

-- CreateIndex
CREATE INDEX "team_members_is_leader_idx" ON "team_members"("is_leader");

-- CreateIndex
CREATE INDEX "team_members_sort_order_idx" ON "team_members"("sort_order");

-- AddForeignKey
ALTER TABLE "portfolio_items" ADD CONSTRAINT "portfolio_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
