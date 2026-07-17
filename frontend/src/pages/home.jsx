import React, { useContext, useEffect, useRef, useState } from 'react'
import Nav from '../components/nav.jsx'
import dp from "../assets/db.svg"
import { FaPlus } from "react-icons/fa6";
import { FaCamera } from "react-icons/fa";
import { userDataContext } from '../context/UserContext.jsx';
import { HiMiniPencilSquare } from "react-icons/hi2";
import EditProfile from '../components/EditProfile.jsx';
import { RxCross2 } from "react-icons/rx";
import { BsFillImageFill } from "react-icons/bs";
import axios from 'axios';
import { authDataContext } from '../context/AuthContext.jsx';
import Post from '../components/Post.jsx';




const Home = () => {

  let { userData, setUserData,getCurrentUser,edit, setEdit,postData,setPostData,getPost,handleGetProfile } = useContext(userDataContext)
  let {serverUrl} = useContext(authDataContext)
  let [frontendImages, setFrontendImages] = useState([])
  let [backendImages, setBackendImages] = useState([])
  let [description, setDescription] = useState("")
  let [uploadPost,setUploadPost] = useState(false)
  let [posting,setPosting] = useState(false)
  let [suggestedUser,setSuggestedUser] = useState([])
  let image = useRef()

  function handleImage(e) {
    const files = Array.from(e.target.files);

    setBackendImages(prev => [...prev, ...files]);

    const previews = files.map(file => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file)
    }));

    setFrontendImages(prev => [...prev, ...previews]);
  }

  
  async function handleUploadPost(){
    setPosting(true)
    try {
      let formdata = new FormData()
      formdata.append("description", description)

      if (backendImages && backendImages.length > 0) {
        backendImages.forEach(file => formdata.append("image", file))
      }

      let result = await axios.post(serverUrl + "/api/post/create", formdata, { withCredentials: true })
      console.log(result)
      setUploadPost(false)
      setFrontendImages("")
      setDescription("")
      setPosting(false)

    } catch (error) {
      setPosting(false)
      console.log(error)
    }
  }

  const handleSuggestedUsers = async ()=>{
    try {
      let result = await axios.get(serverUrl+"/api/user/suggestedusers",{
        withCredentials:true})
        setSuggestedUser(result.data)
        console.log(result.data)

    } catch (error) {
      console.log(error.response)
    }
  }
useEffect(()=>{
  handleSuggestedUsers()

},[])
  useEffect(()=>{
    getCurrentUser()
  })

  return (
    <div className='w-full min-h-[100vh] bg-[#e7e7e1] pt-[57px] flex lg:justify-center items-center lg:items-start gap-5 px-[10px] flex-col lg:flex-row pb-[30px]'>

      {edit && <EditProfile />}

      <Nav />


<div className='
w-full
lg:w-[25%]
bg-white
shadow-lg
rounded-lg
p-2.5
lg:min-h-[calc(100vh-190px)]
overflow-y-auto
'>
        <div className='relative w-full h-[140px] sm:h-[160px] md:h-[180px] lg:h-[220px] bg-gray-300 rounded overflow-hidden cursor-pointer' onClick={() => setEdit(true)}>
          <img src={userData.coverImage || ""} className='w-full h-full object-cover object-center' alt='cover' />
          <div className='absolute bottom-2 right-2  p-2 rounded-full'>
            <FaCamera className='text-white w-[24px] h-[24px] hover:text-gray-300' />
          </div>
        </div>
        <div className='overflow-hidden rounded-full relative top-[-30px] left-[12px] cursor-pointer w-[45px] h-[45px]'>
          <img className='rounded-full w-full h-full object-cover hover:text-gray-600' src={userData.profileImage || dp} onClick={() => setEdit(true)} alt='' />
          <div className=' h-[15px] w-[15px] bg-blue-500 absolute top-[19px] left-[30px] rounded-[20px]'><FaPlus onClick={() => setEdit(true)} className='text-white' /></div>
        </div>

        <div className='mt-[-27px] ml-[13px]'>
          <div className='text-[20px] text-gray-700 font-semibold '>{`${userData.firstName} ${userData.lastName}`}</div>
          <div className='text-[14px] text-gray-500 font-semibold'>{userData.headline}</div>
          <div className='text-[14px] text-gray-500'>{userData.location}</div>
          <button className='w-[100%] h-[35px] flex justify-center items-center gap-[11px] bg-blue-600 text-white rounded-lg mt-[15px] mb-[15px] hover:bg-blue-500 cursor-pointer' onClick={() => setEdit(true)}>Edit Profile<HiMiniPencilSquare /></button>
        </div>
      </div>

                                  {/* --------------  Post Section ------------ */}

     {uploadPost && <div className='w-full h-full bg-gray-600 fixed top-0 left-0 z-[110] opacity-[0.6]'></div> }
      
      {uploadPost && <div className='
w-[90vw]
max-w-[420px]
max-h-[90vh]
fixed
z-[150]
bg-white
shadow-lg
rounded-lg
overflow-hidden
flex
flex-col
border-7 border-gray-300 
'>

        <div className='flex items-center gap-3 px-3 pt-3'>
          <div className='overflow-hidden rounded-full cursor-pointer w-[45px] h-[45px] shrink-0'>
            <img className='rounded-full w-full h-full object-cover hover:text-gray-600' src={userData.profileImage || dp} alt='' />
          </div>
          <div className='text-[20px] text-gray-700 font-semibold leading-none'>{`${userData.firstName} ${userData.lastName}`}</div>
        </div>
        <div className='absolute right-3 top-3 z-150'><RxCross2 className='w-[30px] h-[30px] text-black font-extrabold hover:bg-gray-300 cursor-pointer rounded-[13px]' onClick={()=>setUploadPost(false)}/> </div>
        <textarea value={description} className={`
w-[calc(100%-24px)]
mx-3
mt-4
px-4
py-3
resize-none
rounded-lg
border
border-gray-300
outline-none
transition-all
duration-300
${frontendImages.length > 0 ? "h-[120px]" : "h-[220px]"}
`}
          placeholder='Write your content here..' onChange={(e) => setDescription(e.target.value)}></textarea>
        <input type='file' ref={image} hidden multiple accept="image/" onChange={handleImage} />


        <div className='flex-1 flex flex-col overflow-hidden'>
          <div className='mx-3 px-5 py-4 flex items-center justify-start border-b-2 border-gray-600'><BsFillImageFill className='w-[26px] h-[26px] cursor-pointer text-gray-500' onClick={() => image.current.click()} /></div>

          <div className="w-full px-3 pb-3">

            {
              frontendImages.length > 0 &&

              <div className="
            max-h-[210px]
            overflow-y-auto
            grid
            grid-cols-2
            gap-2
        ">

                {
                  frontendImages.map((img, index) => (
                    <div
                      key={img.id}
                      className="
                    relative
                    rounded-lg
                    border
                    overflow-hidden
                    bg-gray-100
                    h-[120px]
                    ">

                      <img
                        src={img.url}
                        className="
                        w-full
                        h-full
                        object-contain
                        "
                      />

                      <button

                        onClick={() => {

                          setFrontendImages(prev =>
                            prev.filter((_, i) => i !== index)
                          )

                          setBackendImages(prev =>
                            prev.filter((_, i) => i !== index)
                          )

                        }}

                        className="
                        absolute
                        top-1
                        right-1
                        bg-black/60
                        text-white
                        w-6
                        h-6
                        rounded-full
                        hover:bg-red-500 cursor-pointer
                        "

                      >

                        ✕

                      </button>

                    </div>
                  ))
                }

              </div>

            }

          </div>

          <div className='absolute right-4 bottom-4 flex'>
            <button className='w-[80px] h-[35px] gap-[11px] bg-blue-600 text-white rounded-full hover:bg-blue-500 cursor-pointer' disabled={posting} onClick={handleUploadPost}>{posting ? "Posting..." : "Post"}</button>
          </div>
        </div>
      </div>
      }
      



      <div
className='
w-full
lg:w-[50%]
bg-[#e7e7e1]
flex
flex-col
gap-[20px]
lg:h-[calc(100vh-80px)]
overflow-y-auto
pr-2
'
>
        <div className='w-full h-[90px] bg-white shadow-lg rounded-lg flex gap-[10px] justify-center items-center p-[10px]'>


          <div className='overflow-hidden rounded-full relative top-[3px] left-[-12px] cursor-pointer w-[45px] h-[45px]'>
            <img className='rounded-full w-full h-full object-cover hover:text-gray-600' src={userData.profileImage || dp} alt='' />
          </div>
          <button className='w-[80%] md:h-[100%] border-2 border-gray-500 rounded-full hover:bg-gray-300 cursor-pointer flex justify-start p-[10px]' onClick={()=>setUploadPost(true)}>Make a Post ...</button>

        </div>
{postData.map((post, index) => (
  <Post
    key={index}
    id={post._id}
    description={post.description}
    author={post.author}
    images={post.images || (post.image ? [post.image] : [])}
    like={post.like}
    comment={post.comment}
    createdAt={post.createdAt}
  />
))}

      </div>

                                      {/* ------------Suggested Users ----------- */}

<div
className='
w-full
lg:w-[25%]
bg-white
shadow-lg
small:hidden
lg:flex
flex-col
rounded-lg
lg:min-h-[calc(100vh-470px)]
overflow-y-auto mb-[10px] pb-[10px]
'
>
        <h1 className='text-[20px] text-gray-800 font-semibold p-[10px] flex justify-center'>Suggested Users</h1>
  {suggestedUser.length>0 && 
  <div className='flex flex-col gap-[10px]'>
    {suggestedUser.map((su)=>(
      <div className='flex items-center gap-[10px] ml-[10px] hover:bg-gray-200 cursor-pointer rounded-lg ' onClick={()=>handleGetProfile(su.userName)}>
         <div className='overflow-hidden rounded-full w-[35px] h-[35px]  '><img className='w-full h-full rounded-full object-cover' src={su.profileImage || dp} alt='' /></div>
              <div>
              <div className='text-[17px] font-semibold '>{`${su?.firstName || 'User'} ${su?.lastName || ''}`}</div>
              <div className='text-[13px] '>{su.headline}</div>
              </div>
      </div>
    ))}
  </div>}

   {suggestedUser.length==0 && 
  <div>No Suggested User</div>}
      </div>
    </div>
  )
}

export default Home
