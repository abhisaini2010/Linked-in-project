import React, { useContext, useEffect, useState } from 'react'
import dp from "../assets/db.svg"
import moment from "moment"
import { BiLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa6";
import { BiSolidLike } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import axios from "axios"
import { authDataContext } from "../context/AuthContext"
import { userDataContext } from '../context/UserContext';
import { IoSendSharp } from "react-icons/io5";
import { io } from "socket.io-client"
import ConnectionButton from './ConnectionButton';

let socket = io("http://localhost:8000") //now connection has been established between frontend and backend
moment.updateLocale('en', {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "%d seconds",
    ss: "%d seconds",
    m: "1 minute",
    mm: "%d minutes",
    h: "1 hour",
    hh: "%d hours",
    d: "1 day",
    dd: "%d days",
    M: "1 month",
    MM: "%d months",
    y: "1 year",
    yy: "%d years",
  },
});

const Post = ({ id, author, like, comment, description, images, createdAt }) => {
  const [expanded, setExpanded] = useState(false)
  const maxLen = 180
  const showToggle = description && description.length > maxLen
  const displayedDescription = showToggle ? (expanded ? description : description.slice(0, maxLen) + '...') : description
  let { serverUrl } = useContext(authDataContext)
  let { userData, setUserData, getPost,handleGetProfile } = useContext(userDataContext)
  let [likes, setLikes] = useState(like || [])
  let [commentContent, setCommentContent] = useState("")
  let [comments, setComments] = useState(Array.isArray(comment) ? comment : [])
  let [showComment, setShowComment] = useState(false)

  const handleLike = async () => {
    try {
      let result = await axios.get(serverUrl + `/api/post/like/${id}`, { withCredentials: true })
      console.log(result)
      setLikes(result.data.like)
    } catch (error) {
      console.log(error)
    }
  }
  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentContent.trim()) return
    try {
      let result = await axios.post(serverUrl + `/api/post/comment/${id}`, { content: commentContent }, { withCredentials: true })
      console.log(result)
      setComments(Array.isArray(result?.data?.comment) ? result.data.comment : [])
      setCommentContent("")
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(serverUrl + `/api/post/delete/${id}`, { withCredentials: true })
        getPost()
      } catch (error) {
        console.log(error)
        alert("Error deleting post")
      }
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        let result = await axios.delete(serverUrl + `/api/post/comment/${id}/${commentId}`, { withCredentials: true })
        setComments(Array.isArray(result?.data?.comment) ? result.data.comment : [])
      } catch (error) {
        console.log(error)
        alert("Error deleting comment")
      }
    }
  }

  useEffect(() => {   //  ye wo event hai jo humne backend se emit kiya tha or use yaha par listen kar rahe hai 
    socket.on("likeUpdated", ({ postId, likes }) => {
      if (postId == id) {
        setLikes(likes)
      }
    })

    socket.on("commentUpdated", ({ postId, comm }) => {
      if (postId == id) {
        setComments(comm)
      }
    })
    return () => {
      socket.off("likeUpdated")
      socket.off("commentUpdated")
    }
  }, [id])


  useEffect(() => {
    getPost
  }, [likes, setLikes, comments])

  return (
    <div className='w-full bg-white rounded-lg shadow-lg p-4'>
      <div className='flex items-start gap-3 justify-between'>
        <div className='flex items-start gap-3 flex-1'>
          <div className='overflow-hidden rounded-full w-[45px] h-[45px] shrink-0'onClick={()=>handleGetProfile(author.userName)}>
            <img className='rounded-full w-full h-full object-cover' src={(author && author.profileImage) || dp} alt='' />
          </div>

          <div className='flex flex-col'>
            <div className='text-[18px] text-gray-700 font-semibold'>
              {author ? `${author.firstName || ""} ${author.lastName || ""}` : "Unknown"}
            </div>
            <div className='text-[13px] text-gray-500'>{author?.headline}</div>
            <div className='text-[13px] text-gray-500'>{moment(createdAt).fromNow()}</div>
          </div>
        </div>

        <div>
          {userData._id != author._id && <ConnectionButton userId={author._id} />}
        </div>

        {author?._id === userData._id && (
          <button onClick={handleDeletePost} className='text-red-600 hover:bg-red-100 p-2 rounded-full'>
            <MdDelete className='text-[20px]' />
          </button>
        )}
      </div>

      <div className='mt-3'>
        <div className='text-gray-800'>
          {displayedDescription}
          {showToggle && (
            <button onClick={() => setExpanded(prev => !prev)} className='ml-2 text-blue-600 text-sm cursor-pointer'>
              {expanded ? 'Read less' : 'Read more'}
            </button>
          )}
        </div>
        {images && images.length > 0 && (
          <div className='mt-2 grid grid-cols-2 gap-2'>
            {images.map((img, i) => (
              <img key={i} src={img} className='w-full h-36 object-cover rounded' />
            ))}
          </div>
        )}
      </div>
      <div className='flex justify-between mt-[5px] border-b-[2px]'>
        <div className='flex items-center gap-1.5 '><span className='text-gray-600'>{likes.length}</span> <BiLike className='text-[#09a5ed] h-[16px] w-[16px] hover:bg-gray-300  cursor-pointer rounded-lg' /></div>
        <div>{comments.length} Comments</div>
      </div>
      <div className='flex p-[14px] pl-0 gap-3.5 '>
        {!likes.includes(userData._id) && <div className='flex gap-[5px] justify-center items-center cursor-pointer hover:bg-gray-300 rounded-full p-[5px]' onClick={handleLike}><BiLike />
          <span>like</span></div>}

        {likes.includes(userData._id) && <div className='flex gap-[5px] justify-center items-center cursor-pointer hover:bg-gray-300 rounded-full  p-[5px]' onClick={handleLike}><BiSolidLike className='text-[#09a5ed] ' />
          <span className='text-[#09a5ed] '>liked</span></div>}

        <div onClick={() => setShowComment(!showComment)} className='flex gap-[5px] justify-center items-center cursor-pointer hover:bg-gray-300 rounded-full  p-[5px]'><FaRegCommentDots /><span>comment</span></div>
      </div>

      {showComment && <div>
        <form onSubmit={handleComment} className='w-full flex justify-between items-center border-b-2 border-b-gray-300 p-[10px]'>
          <input type='text' value={commentContent} onChange={(e) => setCommentContent(e.target.value)} placeholder={"Comment..."} className='outline-none  border-none w-full' />
          <button><IoSendSharp className='text-[#09a5ed] hover:bg-gray-200 cursor-pointer p-[5px] h-[37px] w-[30px] rounded-full' /></button>
        </form>

        <div className='mt-2'>
          {comments.map((com, index) => {
            const commenter = com?.user
            return (
              <div key={com?._id || index} className='flex items-start gap-3 px-2 py-2 border-t border-gray-200'>
                <div className='overflow-hidden rounded-full w-[40px] h-[40px] shrink-0'>
                  <img className='rounded-full w-full h-full object-cover' src={commenter?.profileImage || dp} alt='' />

                </div>

                <div className='flex-1 rounded-lg bg-gray-100 px-3 py-2'>
                  <div className='flex justify-between items-start'>
                    <div className='text-[15px] text-gray-700 font-semibold'>
                      {commenter ? `${commenter.firstName || ""} ${commenter.lastName || ""}`.trim() || "Unknown" : "Unknown"}
                    </div>
                    {commenter?._id === userData._id && (
                      <button onClick={() => handleDeleteComment(com._id)} className='text-red-600 hover:bg-red-100 p-1 rounded'>
                        <MdDelete className='text-[16px]' />
                      </button>
                    )}
                  </div>
                  <div className='text-[12px] text-gray-500 mt-1'>
                    {com?.createdAt ? moment(com.createdAt).format('MMM DD, h:mm A') : 'just now'}
                  </div>

                  <div className='text-[14px] text-gray-700 mt-1'>{com?.content || ""}</div>
                </div>
              </div>
            )
          })}
        </div>

      </div>}



    </div>
  )
}

export default Post
