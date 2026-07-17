import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import {authDataContext} from "../context/AuthContext"
import {userDataContext} from "../context/UserContext"
import io from "socket.io-client"
import { useNavigate } from 'react-router-dom'
const socket = io("https://linkedin-backend-llme.onrender.com")

const ConnectionButton = ({userId}) => {

let {serverUrl} = useContext(authDataContext)
let {userData,setUserData} = useContext(userDataContext)
let [status,setStatus] = useState("")
let navigate = useNavigate()

const handleSendConnection = async ()=>{
    try {
        let result = await axios.post(`${serverUrl}/api/connection/send/${userId}`,{},{
          withCredentials:true
        })
        console.log(result)
    } catch (error) {
        console.log(error)
    }
}
const handleRemoveConnection = async ()=>{
    try {
        let result = await axios.delete(`${serverUrl}/api/connection/remove/${userId}`,{
          withCredentials:true
        })
        console.log(result)
    } catch (error) {
        console.log(error)
    }
}
const handleGetStatus = async ()=>{
    try {
        let result = await axios.get(`${serverUrl}/api/connection/getstatus/${userId}`,{
          withCredentials:true
        })
        console.log(result)
        setStatus(result.data.status)

    } catch (error) {
        console.log(error)
    }
}

useEffect(()=>{

  socket.emit("register",userData._id)
  handleGetStatus()

  socket.on("statusUpdate",({updateUserId,newStatus})=>{
    if(updateUserId == userId){
    setStatus(newStatus)
    }
  })

},[userId])

const handleClick = async ()=>{
  if (status=="Disconnect"){
    await handleRemoveConnection()
  }
  else if(status=="recieved"){
navigate("/network")
  }
  else{
await handleSendConnection()
  }
}

  return (
    <div>
      <button onClick={handleClick} disabled={status=="pending"} className='bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 cursor-pointer'>{status}</button>
      
    </div>
  )
}

export default ConnectionButton
