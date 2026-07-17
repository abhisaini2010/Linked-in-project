import express from "express"
import isAuth from "../middlewares/isAuth.js"
import {acceptConnection, sendConnection,getConnectionStatus,rejectConnection, removeConnection, getConnectionRequests, getUserConnections} from "../controllers/connection.controllers.js"

let connectionRouter = express.Router()

connectionRouter.post("/send/:id",isAuth,sendConnection)
connectionRouter.put("/accept/:connectionId",isAuth,acceptConnection)  // yaha par hum connection ki id bhejenge na ki kisi user ki
connectionRouter.put("/reject/:connectionId",isAuth,rejectConnection)  
connectionRouter.get("/getstatus/:userId",isAuth,getConnectionStatus)  
connectionRouter.delete("/remove/:userId",isAuth,removeConnection)  
connectionRouter.get("/requests/",isAuth,getConnectionRequests)  
connectionRouter.get("/",isAuth,getUserConnections)  

export default connectionRouter