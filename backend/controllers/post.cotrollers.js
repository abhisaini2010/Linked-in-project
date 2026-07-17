import Post from "../models/post.model.js"
import uploadOnCloudinary from "../config/cloudinary.js"
import { io } from "../index.js";
import Notification from "../models/notification.js";

export const createPost = async (req,res)=>{
    try {
        let {description} = req.body
        let newPost;
        if (req.files && req.files.length > 0) {
            const uploads = await Promise.all(req.files.map(f => uploadOnCloudinary(f.path)));
            newPost = await Post.create({
                author: req.userId,
                description,
                images: uploads
            })
        } else {
            newPost = await Post.create({
                author: req.userId,
                description,

            })
        }
        return res.status(201).json(newPost)
    } catch (error) {
        return res.status(400).json(`Create post error : ${error}`)
    }}

    export const getPost = async (req,res)=>{
        try {
            const post = await Post.find()
                .populate("author","firstName lastName profileImage headline userName")
                .populate("comment.user","firstName lastName profileImage headline")
                .sort({createdAt:-1})
            return res.status(200).json(post)
        } catch (error) {
            return res.status(500).json({message:"getPost error"})
        }
    }

    export const like = async (req,res)=>{
        try {
            let postId = req.params.id
            let userId = req.userId
            let post = await Post.findById(postId)
            if(!post){
                return res.status(400).json({message:"Post not found"})
            }
            if(post.like.includes(userId)){
                post.like = post.like.filter((id)=>id != userId)
            }
            else{
                post.like.push(userId)
                if(post.author != userId)   // iska matlab post ko like karne wala humara alawa koi or hai bas hum nahi ho
                {let notification = await Notification.create({
                    receiver : post.author,
                    type : "like",
                    relatedUser : userId,  // yye vo banda hai jisne like kiya
                    relatedPost : postId
                })}
            }
            await post.save()

            io.emit("likeUpdated",{  // emit use kiye jate hai hai koi event bhejne k liye
                postId,
                likes:post.like
            })

            res.status(200).json(post)
        } catch (error) {
            return res.status(500).json({message:`like error ${error}`})   
        }
    }

    export const comment = async (req,res)=>{
        try {
            let postId = req.params.id
            let userId = req.userId
            let {content} = req.body

            let post = await Post.findById(postId)
            if(!post){
                return res.status(404).json({message:"Post not found"})
            }

            post.comment.push({ 
                content, 
                user: userId,
                createdAt: new Date()
            })
            await post.save()
             io.emit("commentUpdated",{  // emit use kiye jate hai hai koi event bhejne k liye
                postId,
                comm:post.comment
            })
            await post.populate("comment.user","firstName lastName profileImage headline")
            res.status(200).json(post)

             if(post.author != userId){
             let notification = await Notification.create({
                    receiver : post.author,
                    type : "comment",
                    relatedUser : userId,  // yye vo banda hai jisne like kiya
                    relatedPost : postId
                })
            }

        } catch (error) {
        return res.status(500).json({message:`comment error ${error}`})   
            
        }
    }

    export const deletePost = async (req,res)=>{
        try {
            let postId = req.params.id
            let userId = req.userId
            
            let post = await Post.findById(postId)
            if(!post){
                return res.status(404).json({message:"Post not found"})
            }
            
            if(post.author.toString() !== userId.toString()){
                return res.status(403).json({message:"You can only delete your own posts"})
            }
            
            await Post.findByIdAndDelete(postId)
            res.status(200).json({message:"Post deleted successfully"})
        } catch (error) {
            return res.status(500).json({message:`Delete post error: ${error}`})
        }
    }

    export const deleteComment = async (req,res)=>{
        try {
            let postId = req.params.postId
            let commentId = req.params.commentId
            let userId = req.userId
            
            let post = await Post.findById(postId)
            if(!post){
                return res.status(404).json({message:"Post not found"})
            }
            
            let comment = post.comment.id(commentId)
            if(!comment){
                return res.status(404).json({message:"Comment not found"})
            }
            
            if(comment.user.toString() !== userId.toString()){
                return res.status(403).json({message:"You can only delete your own comments"})
            }
            
            post.comment.id(commentId).deleteOne()
            await post.save()
            await post.populate("comment.user","firstName lastName profileImage headline")
            res.status(200).json(post)
        } catch (error) {
            return res.status(500).json({message:`Delete comment error: ${error}`})
        }
    }