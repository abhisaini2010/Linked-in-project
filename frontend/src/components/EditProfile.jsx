import  { useContext, useEffect, useRef, useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { userDataContext } from '../context/UserContext';
import dp from "../assets/db.svg"
import { FaPlus } from "react-icons/fa6";
import { FaCamera } from "react-icons/fa";
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';



const EditProfile = () => {
  let { userData, setUserData, setEdit } = useContext(userDataContext)
  let{serverUrl} = useContext(authDataContext)
  let [firstName, setFirstName] = useState(userData.firstName || "")
  let [lastName, setLastName] = useState(userData.lastName || "")
  let [userName, setUserName] = useState(userData.userName || "")
  let [headline, setHeadline] = useState(userData.headline || "")
  let [location, setLocation] = useState(userData.location || "")
  let [gender, setGender] = useState(userData.gender || "")
  let [skills, setSkills] = useState(userData.skills || [])
  let [newskills, setNewSkills] = useState("")
  let [education, setEducation] = useState(userData.education || [])
  let [newEducation, setNewEducation] = useState({
    college: "",
    degree: "",
    fieldOfStudy: ""
  })
  let [experience, setExperience] = useState(userData.experience || [])
  let [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    description: ""
  })

  let [frontendProfileImage,setFrontendProfileImage] = useState(userData.profileImage || dp )
  let [backendProfileImage,setBackendProfileImage] = useState(null )
  let [frontendCoverImage,setFrontendCoverImage] = useState(userData.coverImage || null )
  let [backendCoverImage,setBackendCoverImage] = useState(null)
  let [saving,setSaving] = useState(false)
  let [isVisible, setIsVisible] = useState(false)
  let [isClosing, setIsClosing] = useState(false)


  const profileImage = useRef()
  const coverImage = useRef()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
      setIsClosing(false)
    }, 10)

    return () => clearTimeout(timer)
  }, [])

  function closeModal() {
    setIsVisible(false)
    setIsClosing(true)
    setTimeout(() => {
      setEdit(false)
    }, 250)
  }

  function addSkill(e) {
    e.preventDefault()
    if (newskills && !skills.includes(newskills)) {
      setSkills([...skills, newskills])
    }
    setNewSkills("")
  }

  function addEducation(e) {
    e.preventDefault()
    if (newEducation.college && newEducation.degree && newEducation.fieldOfStudy) {
      setEducation([...education, newEducation])
    }
    setNewEducation({
      college: "",
      degree: "",
      fieldOfStudy: ""
    })
  }

  function addExperience(e) {
    e.preventDefault()
    if (newExperience.title && newExperience.company && newExperience.description) {
      setExperience([...experience, newExperience])
    }
    setNewExperience({
      title: "",
      company: "",
      description: ""
    }
    )
  }


  function removeSkill(skill) {
    setSkills(skills.filter((s) => s !== skill))
  }

  function removeEducation(edu) {
    setEducation(education.filter((ed) => ed !== edu))
  }

  function removeExperience(exp) {
    setExperience(experience.filter((ex) => ex !== exp))
  }

  function handleProfileImage (e) {
 let file = e.target.files[0]
 setBackendProfileImage(file)
 setFrontendProfileImage(URL.createObjectURL(file))
  }

  function handleCoverImage (e) {
 let file = e.target.files[0]
 setBackendCoverImage(file)
 setFrontendCoverImage(URL.createObjectURL(file))
  }

  const handleSaveprofile = async ()=>{
    setSaving(true)
    try {
      let formData = new FormData()
      formData.append("firstName",firstName)
      formData.append("lastName",lastName)
      formData.append("userName",userName)
      formData.append("headline",headline)
      formData.append("location",location)
      formData.append("gender",gender)
      formData.append("skills",JSON.stringify(skills))
      formData.append("education",JSON.stringify(education))
      formData.append("experience",JSON.stringify(experience))

      if(backendProfileImage){
        formData.append("profileImage",backendProfileImage)
    }

    if(backendCoverImage){
      formData.append("coverImage",backendCoverImage)
    }

    let result = await axios.put(serverUrl+"/api/user/updateprofile",formData,{withCredentials:true})
    setUserData(result.data);
    console.log(result)
    setSaving(false)
    closeModal();

  }
  
  catch (error) {
      console.log(error)
      setSaving(false)
    }
  }

  return (

    <div className='w-full h-[100vh] fixed top-0  z-100 flex justify-center items-center'>

<input type='file' accept='image/*' hidden ref={profileImage} onChange={handleProfileImage} />
<input type='file' accept='image/*' hidden ref={coverImage} onChange={handleCoverImage}/>


      <div className='w-full h-full bg-black opacity-[0.5] absolute'></div>
      <div className={`w-[90%] max-w-[450px] h-[500px] bg-white relative z-[200] border-[6px] border-slate-300 shadow-[0_12px_40px_rgba(0,0,0,0.25)] rounded-xl p-2.5 overflow-auto transition-all duration-300 ease-out ${isVisible && !isClosing ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className='absolute right-3 top-3 z-10' onClick={closeModal}><RxCross2 className='w-[30px] h-[30px] text-black font-extrabold hover:bg-gray-300 cursor-pointer rounded-[13px]' />

        </div>
        <div className='mb-4 text-center pt-2'>
          <h2 className='text-2xl font-bold text-slate-800 tracking-wide'>Edit Profile</h2>
          <p className='mt-1 text-sm text-slate-500'>Refresh your details and make your profile stand out.</p>
        </div>
        <div className='relative mt-4'>
          <div className='w-full h-[170px] sm:h-[190px] bg-gray-300 rounded-lg overflow-hidden' onClick={()=>coverImage.current.click()}>
            <img src={frontendCoverImage} className='w-full h-full object-cover object-center' alt='cover' />
            <FaCamera className='absolute bottom-3 right-3 text-white w-[35px] h-[35px] hover:text-gray-400 cursor-pointer' />
          </div>
          <div className='absolute bottom-[-28px] left-4 overflow-hidden rounded-full cursor-pointer w-[70px] h-[70px] border-4 border-white shadow-md' onClick={()=>profileImage.current.click()}><img className='rounded-full w-full h-full object-cover' src={frontendProfileImage} alt='' /></div>
          <div className='absolute bottom-[-8px] left-[68px] h-[20px] w-[20px] bg-blue-500 rounded-full flex items-center justify-center'><FaPlus onClick={()=>profileImage.current.click()} className='text-white w-[12px] h-[12px] cursor-pointer' /></div>
        </div>

        <div className='w-full flex flex-col items-center justify-center gap-5 mt-14'>
          <input type='text' placeholder='FirstName' className='w-full h-[50px] outline-none border-gray-600 px-2.5 py-1.5 text-[18px] border-2 rounded-lg' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <input type='text' placeholder='LastName' className='w-full h-[50px] outline-none border-gray-600 px-2.5 py-1.5 text-[18px] border-2 rounded-lg' value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <input type='text' placeholder='UserName' className='w-full h-[50px] outline-none border-gray-600 px-2.5 py-1.5 text-[18px] border-2 rounded-lg' value={userName} onChange={(e) => setUserName(e.target.value)} />
          <input type='text' placeholder='Headline' className='w-full h-[50px] outline-none border-gray-600 px-2.5 py-1.5 text-[18px] border-2 rounded-lg' value={headline} onChange={(e) => setHeadline(e.target.value)} />
          <input type='text' placeholder='Location' className='w-full h-[50px] outline-none border-gray-600 px-2.5 py-1.5 text-[18px] border-2 rounded-lg' value={location} onChange={(e) => setLocation(e.target.value)} />
          <input type='text' placeholder='Gender ( male , female , other )' className='w-full h-[50px] outline-none border-gray-600 px-2.5 py-1.5 text-[18px] border-2 rounded-lg' value={gender} onChange={(e) => setGender(e.target.value)} />

          <div className='w-full p-2.5 border-2 border-gray-600 flex flex-col gap-2.5 rounded-lg'>
            <h1 className='text-[20px] font-semibold'>Skills</h1>
            {skills.length > 0 && <div className=' flex flex-col p-2.5  gap-[20px] '>
              {skills.map((skill, index) => (
                <div className='w-full h-[40px] border-[1px] border-gray-600 bg-gray-200 rounded-md  p-[10px] flex justify-between items-center' key={index}> <span> {skill} </span> <RxCross2 className='w-[20px] h-[20px] text-black font-extrabold  hover:bg-gray-300 cursor-pointer rounded-[13px]' onClick={() => removeSkill(skill)} /></div>
              ))}
            </div>}
            <div className='flex flex-col gap-2.5 items-start' >
              <input type='text' placeholder='Add new skills' value={newskills} className='w-full h-[50px] outline-none border-gray-600 px-2.5 py-1.5 text-[15px] border-2 rounded-lg overflow' onChange={(e) => setNewSkills(e.target.value)} />
              <button type='button' className='w-[100%] h-[45px] flex justify-center items-center gap-[11px] bg-blue-600 text-white rounded-full mt-[15px] mb-[15px] hover:bg-blue-500 cursor-pointer' onClick={addSkill} >Add</button>
            </div>
          </div>

          <div className='w-full p-2.5 border-2 border-gray-600 flex flex-col gap-2.5 rounded-lg'>
            <h1 className='text-[20px] font-semibold'>Education</h1>
            {education && <div className=' flex flex-col p-2.5  gap-[20px] '>
              {education.map((edu, index) => (
                <div className='w-full border-[1px] border-gray-600 bg-gray-200 rounded-md  p-[10px] flex justify-between items-center' key={index}>
                  <div>
                    <div>College : {edu.college}</div>
                    <div>Degree : {edu.degree}</div>
                    <div>Field of Study : {edu.fieldOfStudy}</div>
                  </div>
                  <RxCross2 className='w-[20px] h-[20px] text-black font-extrabold  hover:bg-gray-300 cursor-pointer rounded-[13px]' onClick={() => removeEducation(edu)} /></div>
              ))}
            </div>}
            <div className='flex flex-col gap-2.5 items-start' >

              <input type='text' placeholder='College' value={newEducation.college} className='w-full h-[50px] outline-none border-gray-600 px-2.5 py-1.5 text-[15px] border-2 rounded-lg overflow' onChange={(e) => setNewEducation({ ...newEducation, college: e.target.value })} />
              <input type='text' placeholder='Degree' value={newEducation.degree} className='w-full h-[50px] outline-none border-gray-600 px-2.5 py-1.5 text-[15px] border-2 rounded-lg overflow' onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })} />
              <input type='text' placeholder='Field of Study' value={newEducation.fieldOfStudy} className='w-full h-[50px] outline-none border-gray-600 px-2.5 py-1.5 text-[15px] border-2 rounded-lg overflow' onChange={(e) => setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })} />
              <button type='button' className='w-[100%] h-[45px] flex justify-center items-center gap-[11px] bg-blue-600 text-white rounded-full mt-[15px] mb-[15px] hover:bg-blue-500 cursor-pointer' onClick={addEducation} >Add</button>
            </div>
          </div>

          <div className='w-full p-2.5 border-2 border-gray-600 flex flex-col gap-2.5 rounded-lg'>
            <h1 className='text-[20px] font-semibold'>Experience</h1>
            {experience && <div className=' flex flex-col p-2.5  gap-[20px] '>
              {experience.map((exp, index) => (
                <div className='w-full border-[1px] border-gray-600 bg-gray-200 rounded-md  p-[10px] flex justify-between items-center' key={index}>
                  <div>
                    <div>Title : {exp.title}</div>
                    <div>Company : {exp.company}</div>
                    <div>Description : {exp.description}</div>
                  </div>
                  <RxCross2 className='w-[20px] h-[20px] text-black font-extrabold  hover:bg-gray-300 cursor-pointer rounded-[13px]' onClick={() => removeExperience(exp)} /></div>
              ))}
            </div>}
            <div className='flex flex-col gap-2.5 items-start' >

              <input type='text' placeholder='Title' value={newExperience.title} className='w-full h-[50px] outline-none border-gray-600 px-2.5 py-1.5 text-[15px] border-2 rounded-lg overflow' onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })} />
              <input type='text' placeholder='Company' value={newExperience.company} className='w-full h-[50px] outline-none border-gray-600 px-2.5 py-1.5 text-[15px] border-2 rounded-lg overflow' onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })} />
              <input type='text' placeholder='Description' value={newExperience.description} className='w-full h-[50px] outline-none border-gray-600 px-2.5 py-1.5 text-[15px] border-2 rounded-lg overflow' onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })} />
              <button type='button' className='w-[100%] h-[45px] flex justify-center items-center gap-[11px] bg-blue-600 text-white rounded-full mt-[15px] mb-[15px] hover:bg-blue-500 cursor-pointer' onClick={addExperience} >Add</button>
            </div>
          </div>
          <button  className='w-[100%] h-[45px] flex justify-center items-center gap-[11px] bg-[#2dabce] border-2 border-[#0582bc]  text-white rounded-lg mt-[15px] mb-[15px] hover:bg-[#047baa]  cursor-pointer' disable={saving} onClick={handleSaveprofile}>{saving ? "saving..." : "Save Changes"}</button>
        </div>


      </div>

    </div>
  )
}

export default EditProfile
