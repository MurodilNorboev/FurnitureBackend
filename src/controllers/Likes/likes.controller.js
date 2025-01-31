import { asyncHandler } from "../../middleware/asynnc-handler.middleware.js";
import { StatusCodes } from "http-status-codes";
import { Likes } from "../../models/Likes/like.model.js";
import mongoose, { mongo } from "mongoose";

export class MyLikes {
  static addLikes = asyncHandler(async (req, res) => {
    const { user, likeId } = req.body;

    const data = await Likes.findOneAndUpdate(
      { user: user._id },
      { $addToSet: { furniture: likeId }, $set: { user: user._id } },
      { upsert: true }
    ).populate("furniture");
    res.status(StatusCodes.CREATED).json({ success: true, data });
  });

  static deleteLikes = asyncHandler(async (req, res) => {
    const { likeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(likeId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid likeId format!",
      });
    }

    const likeDoc = await Likes.findOne({ furniture: likeId });
    if (!likeDoc) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Like not found!",
      });
    }

    likeDoc.furniture = likeDoc.furniture.filter(
      (item) => item.toString() !== likeId
    );

    await likeDoc.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Successfully removed like!",
      data: likeDoc,
    });
  });

  static getLikes = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const users = await Likes.find({ user: userId }).populate({
      path: "furniture",
    });

    if (!users) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Foydalanuvchi ID'si ko'rsatilmagan",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: users,
    });
  });
}
