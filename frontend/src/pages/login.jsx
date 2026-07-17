import React, { useContext, useState } from 'react'
import logo from "../assets/logo.svg"
import {useNavigate} from "react-router-dom"
import { authDataContext } from '../context/AuthContext'
import { userDataContext} from '../context/UserContext'
import axios from "axios"
const logIn = () => {

let[show,setshow] = useState(false)
let navigate = useNavigate()  // useNavigate() will return a function
let {serverUrl} = useContext(authDataContext)
let {userData,setUserData} = useContext(userDataContext)

let [firstName,setFirstName] = useState("") 
let [lastName,setLastName] = useState("") 
let [userName,setUserName] = useState("") 
let [email,setEmail] = useState("") 
let [password,setPassword] = useState("") 
let [loading,setLoading] = useState(false)
let[err,setErr] = useState("")

const handleSignIn = async (e)=>{
  e.preventDefault()
  setLoading(true)
  try {
    let result = await axios.post(serverUrl+"/api/auth/login",{
      email:email,
      password:password
    },{withCredentials:true})
    console.log(result)
    setUserData(result.data)
    navigate("/")
    setLoading(false)  
    setEmail("")
    setPassword("")
    setErr("")

  } catch (error) {
    setErr(error?.response?.data?.message || error?.message || error)
    console.log(error?.response?.data?.message || error?.message || error)
    setLoading(false)
  }
}

  return (
    <div className='w-full h-screen bg-white flex flex-col justify-center items-center gap-2.5'>
        <div className='w-full pt-[3px] lg:pt-[5px] pl-[18px] flex items-center'>
            <img  className="w-[130px] " src={logo} alt="" />
        </div>
    <form className='w-[90%] max-w-[400px] md:shadow-xl flex flex-col justify-start gap-2 p-4 -mt-8' onSubmit={handleSignIn}> 
    <h1 className='text-gray-700 text-[30px] font-bold mb-3'>Sign In</h1>
   
    <input value={email} type='email' placeholder=' Email' required className='w-[100%] h-[40px] border-1 rounded-[6px] mb-[10px] text-[18px] pl-3' onChange={(e)=>setEmail(e.target.value)}/>
    <div className='w-[100%] h-[40px] border-1 rounded-[6px] mb-[10px] text-[18px] relative'>
    <input value={password} type={show ? "text" : "password" } placeholder=' Password' required className='w-full h-full  rounded-[6px] mb-[10px] text-[18px] pl-3' onChange={(e)=>setPassword(e.target.value)}/>
    <span className='absolute right-2 top-1/2 -translate-y-1/2 text-[#24b2ff] cursor-pointer rounded-[15px] w-[60px] bg-blue-100 flex items-center justify-center' onClick={()=>setshow(prev=>!prev)}>{show ? "hide" : "show"}</span>
    </div>
    {err && <p className='text-red-500 text-[14px] font-semibold'>* {err}</p>}
    <button className='bg-blue-500 text-white rounded-[40px] w-[100%] h-[40px] mt-3 cursor-pointer ' disabled = {loading} >{ loading ? "Loading.." :"Sign In" }</button>
    <p className='text-center cursor-pointer'  onClick={()=>navigate("/signup")}>Create new Account<span className='text-[#079cec] '> Sign Up</span> </p>
    </form>
    </div>
  )
}

export default logIn

