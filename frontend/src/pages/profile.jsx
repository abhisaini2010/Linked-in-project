import React, { useContext, useEffect, useState } from 'react'
import Nav from '../components/nav'
import { FaCamera } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { HiMiniPencilSquare } from "react-icons/hi2";
import EditProfile from '../components/EditProfile.jsx';
import { RxCross2 } from "react-icons/rx";
import { BsFillImageFill } from "react-icons/bs";
import { userDataContext } from '../context/UserContext.jsx';
import {authDataContext} from "../context/AuthContext"
import Post from '../components/Post.jsx';



import axios from 'axios';
import ConnectionButton from '../components/ConnectionButton.jsx';


const Profile = () => {
  let { userData, setUserData,getCurrentUser,edit, setEdit,postData,setPostData,profileData,setProfileData } = useContext(userDataContext)
  let {serverUrl} = useContext(authDataContext)
  let [profilePost,setProfilePost]= useState([])
  
  
    const handleGetUserConnection = async()=>{
        try {
            let result = await axios.get(`${serverUrl}/api/connection`,{
          withCredentials:true
        })
        setUserConnection(result.data)
        } catch (error) {
           console.log(error) 
        }
    }



useEffect(()=>{
  setProfilePost(postData.filter((post)=>post.author._id == profileData._id))
},[profileData])

  return (
    <div className=' w-full min-h-[100vh] bg-[#e7e7e1]  flex flex-col items-center pt-[80px] pb-[30px]'>
<Nav/>
{edit && <EditProfile/>}

      <div className='w-full max-w-[900px] min-h-[100vh] flex flex-col gap-[10px]'>
        {/* images wala div */}
<div className='bg-white pb-[30px] rounded shadow-lg'>
 <div className='relative w-full h-[140px] sm:h-[160px] md:h-[180px] lg:h-[220px] bg-gray-300 rounded overflow-hidden cursor-pointer' onClick={() => setEdit(true)}>
          <img src={profileData.coverImage || ""} className='w-full h-full object-cover object-center' alt='cover' />
          <div className='absolute bottom-2 right-2  p-2 rounded-full'>
            <FaCamera className='text-white w-[24px] h-[24px] hover:text-gray-300' />
          </div>
        </div>
        <div className='overflow-hidden rounded-full relative top-[-30px] left-[12px] cursor-pointer w-[45px] h-[45px]'>
          <img className='rounded-full w-full h-full object-cover hover:text-gray-600' src={profileData.profileImage || dp} onClick={() => setEdit(true)} alt='' />
          <div className=' h-[15px] w-[15px] bg-blue-500 absolute top-[19px] left-[30px] rounded-[20px]'><FaPlus onClick={() => setEdit(true)} className='text-white' /></div>
        </div>

        <div className='mt-[-27px] ml-[13px]'>
          <div className='text-[30px] text-gray-700 font-semibold '>{`${profileData.firstName} ${profileData.lastName}`}</div>
          <div className='text-[18px] text-gray-500 font-semibold'>{profileData.headline}</div>
          <div className='text-[17px] text-gray-500'>{profileData.location}</div>
          <div className='text-[15px] text-gray-500'>{`${profileData.connection.length} connection`}</div>
          {profileData._id == userData._id && 
          <button className='min-w-[150px] h-[35px] flex justify-center items-center gap-[11px] bg-blue-600 text-white rounded-full mt-[15px] mb-[15px] hover:bg-blue-500 cursor-pointer' onClick={() => setEdit(true)}>Edit Profile<HiMiniPencilSquare /></button>
          }
          {profileData._id != userData._id && 
          <div className='mt-[10px]'>  <ConnectionButton userId={profileData._id}/></div>
}
        </div>
</div>
{profileData.skills.length>0 && <div className='w-full min-h-[100px] flex flex-col gap-[10px] justify-center p-[20px] font-semibold bg-white shadow-lg rounded-lg relative'> <div className='text-[28px] text-gray-600 '>Skills</div>
<div className='flex flex-wrap justify-start items-center gap-[15px] text-gray-600'>
{profileData.skills.map((skill,index)=>(
  <div key={index}>{skill}</div>
))}
 {profileData._id == userData._id && <button className='min-w-[80px] h-[35px] flex justify-center items-center gap-[11px] bg-blue-600 text-white rounded-full hover:bg-blue-500 cursor-pointer absolute right-[10px] top-[10px]'  onClick={() => setEdit(true)}>Add<FaPlus/></button> }

</div>
</div>}

{profileData.education.length>0 && <div className='w-full min-h-[100px] flex flex-col gap-[10px] justify-center p-[20px] font-semibold bg-white shadow-lg rounded-lg relative'> <div className='text-[28px] text-gray-600 '>Education</div>
<div className='flex flex-wrap justify-start items-center gap-[30px] text-gray-600'>
{profileData.education.map((edu,index)=>(<div key={index}>
  <div >College : {edu.college}</div>
  <div >Degree : {edu.degree}</div>
  <div >Field of Study : {edu.fieldOfStudy}</div></div>
))}
  {profileData._id == userData._id && <button className='min-w-[80px] h-[35px] flex justify-center items-center gap-[11px] bg-blue-600 text-white rounded-full hover:bg-blue-500 cursor-pointer absolute right-[10px] top-[10px]'  onClick={() => setEdit(true)}>Add<FaPlus/></button> }

</div>
</div>}
{profileData.experience.length>0 && <div className='w-full min-h-[100px] flex flex-col gap-[10px] justify-center p-[20px] font-semibold bg-white shadow-lg rounded-lg relative'> <div className='text-[28px] text-gray-600 '>Experience</div>
<div className='flex flex-wrap justify-start items-center gap-[30px] text-gray-600'>
{profileData.experience.map((exp,index)=>(<div key={index}>
  <div >Title : {exp.title}</div>
  <div >Company : {exp.company}</div>
  <div >Description : {exp.description}</div></div>
))}
  {profileData._id == userData._id && <button className='min-w-[80px] h-[35px] flex justify-center items-center gap-[11px] bg-blue-600 text-white rounded-full hover:bg-blue-500 cursor-pointer absolute right-[10px] top-[10px]'  onClick={() => setEdit(true)}>Add<FaPlus/></button> }

</div>
</div>}

<div className='w-full h-[100px] flex items-center p-[20px] text-[22px] text-gray-600 font-semibold bg-white shadow-lg rounded-lg'>{`Post (${profilePost.length})`}</div>

{profilePost.map((post,index)=>(
  <Post  key={index}
    id={post._id}
    description={post.description}
    author={post.author}
    images={post.images || (post.image ? [post.image] : [])}
    like={post.like}
    comment={post.comment}
    createdAt={post.createdAt}/>
))}


      </div>
    </div>
  )
}

export default Profile
