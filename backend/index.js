import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import dns from "dns"
import authRouter from "./routes/authroutes.js"
import userRouter from "./routes/user.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import postRouter from "./routes/post.routes.js"
import connectionRouter from "./routes/connection.routes.js"
import http from "http"
import { Server } from "socket.io"
import console from "console"
import notificationRouter from "./routes/notification.routes.js"

dns.setServers(["1.1.1.1","8.8.8.8"])
dotenv.config()

let port = process.env.PORT || 5000
let app = express()
let server = http.createServer(app)

export const io = new Server(server,{
    cors:({
    origin:"http://localhost:5173",
    credentials:true
})
})
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/post",postRouter)
app.use("/api/connection",connectionRouter)
app.use("/api/notification",notificationRouter)

  export const userSocketMap = new Map()
io.on("connection",(socket)=>{  // socket ka matlab yaha par humara user hai
console.log("user connected : ",socket.id)  // socket ane ap me ek object hai jiske andar id hai or vo id hi humari user ki id hai 
socket.on("register",(userId)=>{
    userSocketMap.set(userId,socket.id)  // har ek user ki ek apni socket id hoti hoti hai
    console.log(userSocketMap)
})
socket.on("disconnect",(socket)=>{
    console.log("user disconnected : ",socket.id)
})

})

server.listen(port,()=>{
    connectDB()
console.log("Server is started")
})