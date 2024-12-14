import { asyncHandler } from "../../middleware/asynnc-handler.middleware.js";
import { Session } from "../../models/Session/session.madel.js";
import { StatusCodes } from "http-status-codes";

// Yangi sessiya qo'shish
export const addSession = asyncHandler(async (req, res) => {
  const { date, direct, referral, organic } = req.body;

  const newSession = await Session.create({ date, direct, referral, organic });
  res.status(StatusCodes.CREATED).json({ success: true, data: newSession });
});

// Barcha sessiyalarni olish
    export const getAllSessions = asyncHandler(async (req, res) => {
      const { year, month } = req.query;  // Yil va oyni query parametrlaridan oling
      
      // Yil va oy qiymatlarining to‘g‘riligini tekshirish
      if (!year || !month || isNaN(year) || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).json({
          success: false,
          error: {
            statusCode: 400,
            statusMsg: "Bad Request",
            msg: "Invalid year or month format",
          }
        });
      }
    
      // Yil va oyni sana formatiga o‘zgartirish
      const startOfMonth = new Date(year, month - 1, 1);  // Oyni 0-dan boshlash
      const endOfMonth = new Date(year, month, 0);  // Oyning oxirgi kunini olish
    
      if (isNaN(startOfMonth.getTime()) || isNaN(endOfMonth.getTime())) {
        return res.status(400).json({
          success: false,
          error: {
            statusCode: 400,
            statusMsg: "Bad Request",
            msg: "Invalid start or end date",
          }
        });
      }
    
      // Sessiyalarni olish
      const sessions = await Session.find({
        date: { $gte: startOfMonth.toISOString().split("T")[0], $lte: endOfMonth.toISOString().split("T")[0] }
      });
    
      res.status(StatusCodes.OK).json({ success: true, data: sessions });
    });