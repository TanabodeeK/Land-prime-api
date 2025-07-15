import express from "express";
import { createPost, deletePost, getAllPost } from "../controllers/userController.js";
import uploadMiddleware from "../middlewares/uploadMiddleware.js";
import { authUserCheck } from "../middlewares/authMiddleware.js";

const postRouter = express.Router();

postRouter.post("/post",authUserCheck,uploadMiddleware.array('image',10),createPost);
postRouter.delete("/delete-post/:id",authUserCheck,uploadMiddleware.array('image',10),deletePost);
postRouter.get('/post',getAllPost)
// postRouter.post("/post",createPost);

export default postRouter;
