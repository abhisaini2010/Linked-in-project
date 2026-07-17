import express from "express"
import isAuth from "../middlewares/isAuth.js"
import upload from "../middlewares/multer.js"
import { comment, createPost, getPost, like, deletePost, deleteComment } from "../controllers/post.cotrollers.js"

const postRouter = express.Router()

postRouter.post("/create",isAuth,upload.array("image",4),createPost)
postRouter.get("/getpost",isAuth,getPost)
postRouter.get("/like/:id",isAuth,like)
postRouter.post("/comment/:id",isAuth,comment)
postRouter.delete("/delete/:id",isAuth,deletePost)
postRouter.delete("/comment/:postId/:commentId",isAuth,deleteComment)

export default postRouter