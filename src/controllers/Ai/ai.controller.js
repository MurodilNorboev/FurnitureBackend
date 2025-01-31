import { asyncHandler } from "../../middleware/asynnc-handler.middleware";

export class AiController {
    static AiChat = asyncHandler( async (req, res) => {
        const { message } = req.body;
    })
}