-- CreateTable
CREATE TABLE "sector" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_type_sector" INTEGER,
    "id_log_sector_invalid" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    CONSTRAINT "sector_id_type_sector_fkey" FOREIGN KEY ("id_type_sector") REFERENCES "type_sector" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "sector_id_log_sector_invalid_fkey" FOREIGN KEY ("id_log_sector_invalid") REFERENCES "log_sector_invalid" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "type_sector" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "id_glpi" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "log_sector_invalid" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "equipment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_type_equipment" INTEGER,
    "serie" TEXT NOT NULL,
    "id_log_equipment_invalid" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    CONSTRAINT "equipment_id_type_equipment_fkey" FOREIGN KEY ("id_type_equipment") REFERENCES "type_equipment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "equipment_id_log_equipment_invalid_fkey" FOREIGN KEY ("id_log_equipment_invalid") REFERENCES "log_equipment_invalid" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "type_equipment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "log_equipment_invalid" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "unit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "asset" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_sector" INTEGER NOT NULL,
    "id_equipment" INTEGER NOT NULL,
    "id_unit" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    CONSTRAINT "asset_id_sector_fkey" FOREIGN KEY ("id_sector") REFERENCES "sector" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "asset_id_equipment_fkey" FOREIGN KEY ("id_equipment") REFERENCES "equipment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "asset_id_unit_fkey" FOREIGN KEY ("id_unit") REFERENCES "unit" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME
);
