import jwt from "jsonwebtoken";
import { permissions, SUPER_ADMIN, ADMIN_PLUS, ADMIN, BASIC_ADMIN } from "../constants/role.constants.js";

const checkRole = (requiredPermission, requiredRole) => {
  return (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found.",
      });
    }

    try {
      const { role: userRole } = jwt.verify(token, process.env.JWT_SECRET) || {};

      if (!userRole) {
        return res.status(403).json({
          success: false,
          message: "User role not determined.",
        });
      }

      if (requiredRole) {
        const roleOrder = [SUPER_ADMIN, ADMIN_PLUS, ADMIN, BASIC_ADMIN];  
        const userRoleIndex = roleOrder.indexOf(userRole);
        const requiredRoleIndex = roleOrder.indexOf(requiredRole);

        if (userRoleIndex === -1 || requiredRoleIndex === -1 || userRoleIndex < requiredRoleIndex) {
          return res.status(403).json({
            success: false,
            message: `Sizga ${requiredRole} roli kerak.`,
          });
        }
      }

      if (permissions[userRole].includes(requiredPermission)) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: "Attempt denied: This action is restricted to higher-level administrators.",
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }
  };
};

export default checkRole;