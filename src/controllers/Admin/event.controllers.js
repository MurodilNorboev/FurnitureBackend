import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../middleware/asynnc-handler.middleware.js";
import { Event } from "../../models/Admin/Event.model.js"

export const createEvent = asyncHandler(async (req, res) => {
    const { titles, descs } = req.body;

    const newEvent = await Event.create({ titles, descs, });

    res.status(StatusCodes.CREATED).json({ success: true, newEvent });
});

export const getEvent = asyncHandler(async (req, res) => {
        const offers = await Event.find();
        res.status(200).json({ success: true, offers });
});
