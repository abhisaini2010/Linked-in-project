import React, { useEffect, useState, useContext } from 'react'
import Nav from '../components/nav'
import axios from 'axios'
import { authDataContext } from "../context/AuthContext"
import {userDataContext} from '../context/UserContext.jsx'
import dp from "../assets/db.svg"
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";


const Network = () => {
    let { serverUrl } = useContext(authDataContext)
    let [connections, setConnections] = useState([])
    let{userData,setUserData} = useContext(userDataContext)
    

    const handleGetRequest = async () => {
        try {
            let result = await axios.get(`${serverUrl}/api/connection/requests`, { withCredentials: true })
            setConnections(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleAcceptConnection = async (requestId)=>{
        try {
            let result = await axios.put(`${serverUrl}/api/connection/accept/${requestId}`,{}, { withCredentials: true })
            setConnections(connections.filter((con)=>con._id !== requestId))
        } catch (error) {
            console.log(error.response)
        }
    }
    const handleRejectConnection = async (requestId)=>{
        try {
            let result = await axios.put(`${serverUrl}/api/connection/reject/${requestId}`,{}, { withCredentials: true })
            setConnections(connections.filter((con)=>con._id !== requestId))

        } catch (error) {
            console.log(error)
        }
    }
    
    useEffect(() => {
        handleGetRequest()
    }, [])
    
  return (
    <div className='w-screen min-h-screen bg-[#f3f2ef] pt-[90px]'>

        <Nav />

        <div className='max-w-4xl mx-auto'>

            {/* Header */}

            <div className='bg-white rounded-lg shadow p-5 mb-5 flex justify-between items-center'>

                <h1 className='text-2xl font-bold'>
                    Invitations ({connections.length})
                </h1>

            </div>

            {
                connections.length > 0 ?

                    connections.map((connection, index) => (

                        <div
                            key={index}
                            className='bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-5 mb-4'
                        >

                            <div className='flex justify-between items-center'>

                                {/* User Info */}

                                <div className='flex items-center gap-4'>

                                    <div className='w-14 h-14 rounded-full overflow-hidden shrink-0'>

                                        <img
                                            src={connection.sender.profileImage || dp}
                                            alt=""
                                            className='w-full h-full object-cover'
                                        />

                                    </div>

                                    <div>

                                        <h2 className='text-lg font-semibold text-gray-800'>
                                            {`${connection.sender?.firstName || "User"} ${connection.sender?.lastName || ""}`}
                                        </h2>

                                        <p className='text-sm text-gray-500'>
                                            {connection.sender.headline || "LinkedIn Member"}
                                        </p>

                                    </div>

                                </div>

                                {/* Buttons */}

                                <div className='flex gap-3'>

                                    <button
                                        onClick={() => handleAcceptConnection(connection._id)}
                                        className='flex items-center gap-2 bg-green-100 hover:bg-green-500 text-green-700 hover:text-white px-4 py-2 rounded-full transition'
                                    >

                                        <IoIosCheckmarkCircleOutline className='text-2xl' />

                                        Accept

                                    </button>

                                    <button
                                        onClick={() => handleRejectConnection(connection._id)}
                                        className='flex items-center gap-2 bg-red-100 hover:bg-red-500 text-red-700 hover:text-white px-4 py-2 rounded-full transition'
                                    >

                                        <RxCrossCircled className='text-2xl' />

                                        Reject

                                    </button>

                                </div>

                            </div>

                        </div>

                    ))

                    :

                    <div className='bg-white rounded-lg shadow p-8 text-center text-gray-500 text-lg'>

                        No pending invitations.

                    </div>

            }

        </div>

    </div>
)
}

export default Network
