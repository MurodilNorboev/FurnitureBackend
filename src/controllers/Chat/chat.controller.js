import { asyncHandler } from "../../middleware/asynnc-handler.middleware.js";
import { v4 as uuidv4 } from 'uuid';

const users = {};

export class MyChat {

    static Chats = asyncHandler(async (req, res) => {
        const { userName } = req.body;

        if (!userName) {
            return res.status(400).json({ success: false, message: 'userName is required!' });
        }

        if (!users[userName]) {
            users[userName] = {
                userId: uuidv4(), 
                accessToken: null,
            };
        }

        res.status(200).json({
            success: true,
            data: users[userName],
        });
    });
    
}