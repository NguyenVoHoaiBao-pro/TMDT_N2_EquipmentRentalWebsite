/* =====================================================
   SEED FILE: seed_02_categories.sql
   Generated at: 2026-06-28 18:44:24
   ===================================================== */

SET FOREIGN_KEY_CHECKS = 0;

INSERT INTO categories (id, name, slug, description, created_at, updated_at) VALUES (1, 'Cameras', 'cameras', 'Digital Camera Bodies', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO categories (id, name, slug, description, created_at, updated_at) VALUES (2, 'Lenses', 'lenses', 'Camera Lenses and Optics', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

SET FOREIGN_KEY_CHECKS = 1;
