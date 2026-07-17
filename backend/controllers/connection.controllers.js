import e from "express"
import Connection from "../models/connection.model.js"
import User from "../models/user.model.js"
import { io,userSocketMap } from "../index.js"
import Notification from "../models/notification.js"

export const sendConnection = async (req,res)=>{
    try {
        let {id} = req.params
        let sender = req.userId
        let user = await User.findById(sender)

        if(sender==id){
            return res.status(400).json({message:"you cannot send request yourself"})
        }
        if(user.connection.includes(id)){
            return res.status(400).json({message:"you are already connected"})
        }
        let existingConnection = await Connection.findOne({
            sender,
            receiver : id,
            status : "pending"
        })
        if(existingConnection){
            return res.status(400).json({message:"request already exist"})
        }
        let newRequest = await Connection.create({
            sender,
            receiver : id
        })

let receiverSocketId = userSocketMap.get(id)
let senderSocketId = userSocketMap.get(sender)

if(receiverSocketId){
    io.to(receiverSocketId).emit("statusUpdate",{updateUserId : sender,newStatus : "received"})    // .to lagane se ek particular user ko bhejega na ki globally ,joki hum apne like wale me kar rahe the
}
if(senderSocketId){
    io.to(senderSocketId).emit("statusUpdate",{updateUserId : id ,newStatus : "pending"})    // .to lagane se ek particular user ko bhejega na ki globally ,joki hum apne like wale me kar rahe the
}

        return res.status(200).json(newRequest)
    } catch (error) {
        return res.status(500).json({message: "Send Connection error"})
    }
}

export const acceptConnection = async(req,res)=>{
    try {
        let {connectionId} = req.params
        let userId = req.userId
        let connection = await Connection.findById(connectionId)

        if(!connection){
            return res.status(400).json({message:"Connection does not exist"})
        }
        if(connection.status!="pending"){
            return res.status(400).json({message:"Request is under process"})   
        }

        connection.status = "accepted"
         let notification = await Notification.create({
                            receiver : connection.sender,
                            type : "connectionAccepted",
                            relatedUser : userId,  
                    
                        })
        await connection.save()

        await User.findByIdAndUpdate(req.userId,{
            $addToSet:{connection:connection.sender._id}
        })
        await User.findByIdAndUpdate(connection.sender._id,{
            $addToSet:{connection:req.userId}
        })

let receiverSocketId = userSocketMap.get(connection.receiver._id.toString())
let senderSocketId = userSocketMap.get(connection.sender._id.toString())

if(receiverSocketId){
    io.to(receiverSocketId).emit("statusUpdate",{updateUserId : connection.sender._id ,newStatus : "Disconnect"})    // .to lagane se ek particular user ko bhejega na ki globally ,joki hum apne like wale me kar rahe the
}
if(senderSocketId){
    io.to(senderSocketId).emit("statusUpdate",{updateUserId : connection.receiver._id ,newStatus : "Disconnect"})    // .to lagane se ek particular user ko bhejega na ki globally ,joki hum apne like wale me kar rahe the
}


        return res.status(200).json({message:"Connection accepted"})
    } catch (error) {
        return res.status(500).json({message:"Connection acceptance error"})
        
    }
}

export const rejectConnection = async(req,res)=>{
    try {
        let {connectionId} = req.params
        let connection = await Connection.findById(connectionId)

        if(!connection){
            return res.status(400).json({message:"Connection does not exist"})
        }
        if(connection.status!="pending"){
            return res.status(400).json({message:"Request is under process"})   
        }

        connection.status = "rejected"
        await connection.save()

         // Notify the sender that the request was rejected
        let senderSocketId = userSocketMap.get(connection.sender.toString());

        if (senderSocketId) {
            io.to(senderSocketId).emit("statusUpdate", {
                updateUserId: connection.receiver.toString(),
                newStatus: "Connect",
            });
        }

        return res.status(200).json({message:"Connection rejected"})
    } catch (error) {
        return res.status(500).json({message:`Connection rejected error :${error}`})
        
    }
}

export const getConnectionStatus = async(req,res)=>{
    try {
        const targetUserId = req.params.userId
        const currentUserId = req.userId

        let currentUser = await User.findById(currentUserId)

        if(currentUser.connection.includes(targetUserId)){  // yaha par hum dono connected hai to button me ab connect ki jagah discoonnect dikhayega
            return res.json({status : "Disconnect"})
        }
        const pendingRequest = await Connection.findOne({
            $or:[
               { sender : currentUserId,receiver : targetUserId },
               { sender : targetUserId,receiver : currentUserId },
            ],
            status : "pending",
        })

        if(pendingRequest){
            if(pendingRequest.sender.toString() === currentUserId.toString()){
                return res.json({status:"pending"})
            }
            else{
                return res.json({status:"recieved", requestId : pendingRequest._id})

            }
        }
        // if no connection or pending req found
        return res.json({status : "Connect"})

    } catch (error) {
        return res.status(500).json({message:"getConnectionStatus error "})
    }
}
export const removeConnection = async (req,res)=>{
    try {
        const myId = req.userId
        const otherUserId = req.params.userId

        await User.findByIdAndUpdate(myId,{ $pull : {connection : otherUserId}})
        await User.findByIdAndUpdate(otherUserId,{ $pull : {connection : myId}})

        let receiverSocketId = userSocketMap.get(otherUserId)
let senderSocketId = userSocketMap.get(myId)

const connectForReceiver = { updateUserId: myId, newStatus: "Connect" }
const connectForSender = { updateUserId: otherUserId, newStatus: "Connect" }

if (receiverSocketId) {
    io.to(receiverSocketId).emit("statusUpdate", connectForReceiver)
}
if (senderSocketId) {
    io.to(senderSocketId).emit("statusUpdate", connectForSender)
}

        res.json({message:"Connection removed successfully"})

    } catch (error) {
        res.status(500).json({ message : "Remove Connection error"})
    }
}

export const getConnectionRequests = async (req,res)=>{
    try {
        const userId = req.userId
        const requests = await Connection.find({ receiver : userId,status:"pending"}).populate("sender","firstName lastName email userName profileImage headline")

        return res.status(200).json(requests)
    } catch (error) {
        console.error("Error in getConnectionRequests controllers : ",error)
        return res.status(500).json({message:"Server error"})
    }
}

export const getUserConnections = async (req,res)=>{
    try{
        const userId = req.userId
        const user = await User.findById(userId).populate("connection","firstName lastName userName profileImage headline connection")
 
       return  res.status(200).json(user.connection)
    }
    catch(error){
         console.error("Error in getUserConnections controllers : ",error)
        return res.status(500).json({message:"Server error"})
    }
}
