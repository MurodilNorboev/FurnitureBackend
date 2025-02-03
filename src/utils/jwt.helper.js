import pkg from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const { sign, verify } = pkg;
const JWT_SECRET = process.env.JWT_SECRET;

export class JwtHelper {
  static sign = async (id, role) => {
    if (!id || !role) {
      throw new Error("Token yaratish uchun ID va ROLE talab qilinadi!");
    }

    const token = sign({ id, role }, JWT_SECRET, { expiresIn: "180d" });
    return token;
  };

  static verify = (token) => {
    try {
      const decoded = verify(token, JWT_SECRET);
      if (!decoded.role) {
        throw new Error("Token ichida role mavjud emas!");
      }

      return decoded;
    } catch (error) {
      throw new Error(("Tokenni tekshirishda xato: ", error.message));
    }
  };
}
