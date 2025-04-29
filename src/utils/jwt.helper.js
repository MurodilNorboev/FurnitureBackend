import pkg from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const { sign, verify } = pkg;
const JWT_SECRET = process.env.JWT_SECRET;

export class JwtHelper {
  static sign = async (id, role = "user") => {
    if (!id) {
      throw new Error("Token yaratish uchun ID talab qilinadi!");
    }

    const token = sign({ id, role }, JWT_SECRET, { expiresIn: "180d" });
    return token;
  };

  static verify = (token) => {
    try {
      const decoded = verify(token, JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error("Tokenni tekshirishda xato: " + error.message);
    }
  };
}
