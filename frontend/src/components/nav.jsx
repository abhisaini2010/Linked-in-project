import React from 'react'
import {useState,useContext,useEffect,useRef} from 'react'
import logo2 from "../assets/logo2.png"
import { CiSearch } from "react-icons/ci";
import { FaHome } from "react-icons/fa";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { IoIosNotifications } from "react-icons/io";
import {userDataContext} from '../context/UserContext.jsx'
import dp from "../assets/db.svg"
import { authDataContext } from '../context/AuthContext.jsx';
import {Navigate,useNavigate,useLocation} from 'react-router-dom'
import axios from 'axios'


const Nav = () => {

let[activesearch,setactivesearch] = useState(false)
let{userData,setUserData,handleGetProfile} = useContext(userDataContext)
let{serverUrl} = useContext(authDataContext)
let[showPopUp,setShowPopUp] = useState(false)
let[isAnimating,setIsAnimating] = useState(false)
let[searchInput,setSearchInput] = useState("")
let[searchData,setSearchData] = useState([])

let popupRef = useRef(null)
let profileButtonRef = useRef(null)
let navigate = useNavigate()
let location = useLocation()

useEffect(()=>{
  const handleClickOutside = (event) => {
    if (
      showPopUp &&
      popupRef.current &&
      !popupRef.current.contains(event.target) &&
      profileButtonRef.current &&
      !profileButtonRef.current.contains(event.target)
    ) {
      setIsAnimating(true)
      setTimeout(() => {
        setShowPopUp(false)
        setIsAnimating(false)
      }, 240)
    }
  }

  document.addEventListener('mousedown', handleClickOutside)
  return () => document.removeEventListener('mousedown', handleClickOutside)
}, [showPopUp])

const togglePopup = () => {
  if (showPopUp) {
    setIsAnimating(true)
    setTimeout(() => {
      setShowPopUp(false)
      setIsAnimating(false)
    }, 240)
  } else {
    setShowPopUp(true)
    setIsAnimating(true)
    setTimeout(() => {
      setIsAnimating(false)
    }, 20)
  }
}

const handleSignOut = async()=>{
  try{
    let result = await axios.get(serverUrl+'/api/auth/logout',{withCredentials:true})
    setUserData(null)
    navigate('/login')
    console.log(result)
  }
  catch(error){
console.log(error)
  }

}

const handleSearch = async ()=>{
try {
  let result = await axios.get(`${serverUrl}/api/user/search?query=${searchInput}`,{withCredentials:true})
setSearchData(result.data)
} catch (error) {
  setSearchData([])
  console.log(error.response)
}
}

useEffect(()=>{
  handleSearch()

},[searchInput])
  return (
    <div className='bg-[#f8f4f4] w-full h-[50px] fixed shadow-md top-0 flex justify-between md:justify-around items-center px-2.5 z-1 '>
       <div className='flex justify-center items-center gap-2.5'>
        <div onClick={()=>{setactivesearch(false)}}>
      <img onClick={()=>navigate("/")} className='w-[50px] h-[40px] mt-[2px]  mr-[15px]' src={logo2} alt="" />
      </div>
      {!activesearch && <div><CiSearch  className='w-[25px] h-[20px] max-sm:cursor-pointer text-gray-700 lg:hidden 'onClick={()=>setactivesearch(true)}/></div>}
        
       {searchData.length>0 && <div className='absolute top-[60px] left-0 lg:left-[210px] md:left-[140px] h-[250px] w-[100%] md:w-[300px] lg:w-[700px] bg-white shadow-lg min-h-[70px] flex flex-col gap-[15px] rounded-md pt-[10px] pb-[8px] overflow-auto'>
{searchData.map((sea)=>(
  <div className='flex gap-[15px] items-center ml-[10px] border-b-2 border-b-gray-300 hover:bg-gray-200 cursor-pointer rounded-lg' onClick={()=>handleGetProfile(sea.userName)}>
      <div className='overflow-hidden rounded-full w-[45px] h-[45px] hover:bg-gray-500 cursor-pointer'><img className='w-full h-full rounded-full object-cover' src={sea.profileImage || dp} alt='' /></div>
      <div>
      <div className='text-[20px] font-semibold'>{`${sea?.firstName || 'User'} ${sea?.lastName || ''}`}</div>
      <div className='text-[14px] '>{sea.headline}</div>
      </div>
  </div>
))}
    </div>} 
    

      <form className={`lg:w-[350px] w-[200px] h-[40px] lg:flex items-center gap-2.5 bg-[#e7e7e1] px-2.5 py-2.5 rounded-md ${!activesearch ? 'hidden' : 'flex'}`}  >
        <div><CiSearch  className='w-[25px] h-[20px] text-gray-700 max-sm:cursor-pointer'/></div>
        <input value={searchInput} onChange={(e)=>setSearchInput(e.target.value)} type='text'className='w-[80%] h-hull bg-transparent outline-none border-0' placeholder='Search Users..'  />
    </form>
    </div>

    {/* Pop-Up */}

    <div className='flex justify-center items-center gap-[20px] '>
      {(showPopUp || isAnimating) && <div ref={popupRef} className={`w-[300px] min-h-[300px] right-[13px] bg-white shadow-lg absolute top-[58px] rounded-lg flex flex-col items-center p-[17px] gap-5 transition-all duration-300 ease-out ${isAnimating ? 'opacity-0 translate-y-[-8px]' : 'opacity-100 translate-y-0'}`}>
      <div className='overflow-hidden rounded-full w-[45px] h-[45px] hover:bg-gray-500 cursor-pointer'><img className='w-full h-full rounded-full object-cover' src={userData.profileImage || dp} alt='' /></div>
      <div className='text-[20px] font-semibold'>{`${userData?.firstName || 'User'} ${userData?.lastName || ''}`}</div>
      <button  onClick={()=>handleGetProfile(userData.userName)} className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 cursor-pointer'>View Profile</button>
      <div className='h-[1px] w-full bg-gray-400 '></div>
      <div onClick= {()=>navigate("/network")} className='flex w-full items-center justify-start hover:bg-gray-200 rounded-full p-[10px] text-gray-600 gap-[10px] cursor-pointer'> <AiOutlineUsergroupAdd className='w-[30px] h-[28px]'/><div>Networks</div></div>
      <button className='bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 cursor-pointer' onClick={handleSignOut}>Sign Out</button>

  
    </div>}
    
    <div
    onClick={() => navigate("/")}
    className={`lg:flex flex-col items-center justify-center hidden cursor-pointer px-3 h-[48px] rounded-lg transition-all duration-200
    ${
        location.pathname === "/"
            ? "bg-blue-100 text-blue-600"
            : "text-gray-600 hover:bg-gray-200"
    }`}
>
    <FaHome className='w-[30px] h-[28px]'/>
    <div>Home</div>
</div>
      <div
    onClick={() => navigate("/network")}
    className={`md:flex flex-col items-center justify-center hidden cursor-pointer px-3 h-[48px] rounded-lg transition-all duration-200
    ${
        location.pathname === "/network"
            ? "bg-blue-100 text-blue-600"
            : "text-gray-600 hover:bg-gray-200"
    }`}
> <AiOutlineUsergroupAdd className='w-[30px] h-[28px]'/><div>Networks</div></div>
      <div
    onClick={() => navigate("/notification")}
    className={`flex flex-col items-center justify-center ml-2.5 cursor-pointer px-3 h-[48px] rounded-lg transition-all duration-200
    ${
        location.pathname === "/notification"
            ? "bg-blue-100 text-blue-600"
            : "text-gray-600 hover:bg-gray-200"
    }`}
><IoIosNotifications className='w-[30px] h-[28px] '/><div className='hidden md:block'>Notification</div></div>
      <div ref={profileButtonRef} className='overflow-hidden rounded-full w-[45px] h-[45px] hover:bg-gray-500 cursor-pointer' onClick={togglePopup}><img className='w-full h-full rounded-full object-cover' src={userData.profileImage || dp} alt='' /></div>
    </div>
    </div>
  )
}

export default Nav
