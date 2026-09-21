-- V2.0 Rule 3: PERSISTED Computed Columns for JSON attribute filtering.
-- These columns are indexed automatically by SQL Server since they are PERSISTED.
-- Run this script manually against the rental_db database.

-- Computed column for RAM attribute
ALTER TABLE products ADD attr_ram AS CAST(JSON_VALUE(attributes, '$.ram') AS NVARCHAR(100)) PERSISTED;

-- Computed column for Size attribute
ALTER TABLE products ADD attr_size AS CAST(JSON_VALUE(attributes, '$.size') AS NVARCHAR(100)) PERSISTED;

-- Create non-clustered indexes on the persisted computed columns for fast lookups
CREATE NONCLUSTERED INDEX IX_products_attr_ram ON products(attr_ram) WHERE attr_ram IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_products_attr_size ON products(attr_size) WHERE attr_size IS NOT NULL;
