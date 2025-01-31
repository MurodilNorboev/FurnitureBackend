import { Router } from "express";
import { MyLikes } from "../../controllers/Likes/likes.controller.js";
import { auth } from "../../middleware/auts.middleware.js";

export const router = Router();

router.post("/like", auth, MyLikes.addLikes); // add like

router.delete("/likedelete/:likeId", MyLikes.deleteLikes); // delete like

router.get("/getlikes/:userId", MyLikes.getLikes); // get like 

