export const SUPER_ADMIN = "super_admin";
export const ADMIN_PLUS = "admin_plus";
export const ADMIN = "admin";
export const BASIC_ADMIN = "basic_admin";

export const permissions = {
  [SUPER_ADMIN]: [
    "manage_users",
    "manage_data",
    "view_statistics",
    "delete_data",
    "update_data",
  ],
  [ADMIN_PLUS]: [
    "manage_users",
    "manage_data",
    "view_statistics",
    "delete_data",
  ],
  [ADMIN]: ["manage_data", "view_statistics", "delete_data"],
  [BASIC_ADMIN]: ["view_statistics"],
};
