/* =====================================================
   SEED FILE: V2__seed_roles.sql
   Generated at: 2026-06-28 23:03:04
   ===================================================== */

SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- SEED DATA: ROLES
-- =====================================================
    INSERT INTO roles (id, role_name, created_at, updated_at)
    VALUES (1, 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
           (2, 'OWNER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
           (3, 'RENTER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);            

SET FOREIGN_KEY_CHECKS = 1;
