import React, { useContext, useEffect, useState } from 'react'
import Nav from '../components/nav'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { MdDeleteOutline } from "react-icons/md";

const Notification = () => {

    const { serverUrl } = useContext(authDataContext)

    const [notificationData, setnotificationData] = useState([])

    const handleNotification = async () => {
        try {
            let result = await axios.get(
                serverUrl + "/api/notification/get",
                { withCredentials: true }
            )

            setnotificationData(result.data)

        } catch (error) {
            console.log(error)
        }
    }

    const deleteOneNotification = async (id) => {

         const confirmDelete = window.confirm(
        "Delete this notification?"
    );

    if (!confirmDelete) return;

        try {

            await axios.delete(
                serverUrl + `/api/notification/deleteone/${id}`,
                { withCredentials: true }
            );

            // Remove notification from UI instantly
            setnotificationData(prev =>
                prev.filter(item => item._id !== id)
            );

        } catch (error) {
            console.log(error);
        }
    }

    const clearAllNotifications = async () => {

         const confirmDelete = window.confirm(
        "Are you sure you want to delete all notifications?"
    );

    if (!confirmDelete) return;

        try {

            await axios.delete(
                serverUrl + "/api/notification",
                { withCredentials: true }
            );

            // Clear UI instantly
            setnotificationData([]);

        } catch (error) {
            console.log(error);
        }
    }

    function handleMessage(type) {
        if (type === "like") {
            return "has liked your post."
        }
        else if (type === "comment") {
            return "has commented on your post."
        }
        else {
            return "has accepted your connection."
        }
    }

    useEffect(() => {
        handleNotification()
    }, [])

    return (
        <div className='w-screen h-screen  bg-[#f3f2ef] pt-[90px]'>

            <Nav />

            <div className='max-w-4xl mx-auto'>

                {/* Header */}

                <div className='bg-white rounded-lg shadow p-5 mb-5 flex justify-between items-center'>

                    <h1 className='text-2xl font-bold'>
                        Notifications ({notificationData.length})
                    </h1>

                    {
                        notificationData.length > 0 &&
                        <button
                            onClick={clearAllNotifications}
                            className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition cursor-pointer'
                        >
                            Delete All
                        </button>
                    }

                </div>
              <div className='h-[68vh] overflow-auto '>      
                {
                    notificationData.map((noti, index) => (

                        <div
                            key={index}
                            className='bg-white rounded-xl shadow-sm p-5 mb-4 hover:shadow-md transition-all hover:bg-gray-200  cursor-pointer'
                        >

                            {/* User Info */}

                           <div className='flex justify-between items-start'>

    <div className='flex items-center gap-3'>

        <div className='w-12 h-12 rounded-full overflow-hidden shrink-0'>
            <img
                src={noti.relatedUser?.profileImage || dp}
                className='w-full h-full object-cover'
                alt=''
            />
        </div>

        <div className='text-lg'>
            <span className='font-semibold'>
                {noti.relatedUser?.firstName}{" "}
                {noti.relatedUser?.lastName}
            </span>{" "}
            {handleMessage(noti.type)}
        </div>

    </div>
   <div className='p-[7px] rounded-full hover:bg-red-200'>                     
    <MdDeleteOutline
        onClick={() => deleteOneNotification(noti._id)}
        className='text-[24px] cursor-pointer text-gray-500 text-red-600 transition '
    />
</div>
</div>

                            {/* Post Preview */}

                            {
                                noti.relatedPost && (

                                    <div className='mt-4 ml-14 bg-gray-100 rounded-lg p-4 flex gap-5'>

                                        {/* Images */}

                                        <div className='grid grid-cols-2 gap-2 w-[180px] shrink-0'>

                                            {
                                                noti.relatedPost.images?.map((image, imgIndex) => (

                                                    <img
                                                        key={imgIndex}
                                                        src={image}
                                                        alt=''
                                                        className='w-[85px] h-[85px] rounded-lg object-cover'
                                                    />

                                                ))
                                            }

                                        </div>

                                        {/* Description */}

                                        <div>

                                            <p className='text-gray-700 leading-6'>
                                                {noti.relatedPost.description.length > 100
                                                    ? noti.relatedPost.description.substring(0, 100) + "..."
                                                    : noti.relatedPost.description}
                                            </p>

                                        </div>

                                    </div>

                                )
                            }

                        </div>

                    ))
                }
               </div>
            </div>

        </div>
    )
}

export default Notification