import { asyncHandler } from "./asynnc-handler.middleware.js";

export const auth = asyncHandler(async ( req, res, next ) => {
    console.log(req.headers);
    
    next();
})