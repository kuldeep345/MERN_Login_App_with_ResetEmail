import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from './assets/profile.png'
import {toast , Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { profileValidator } from '../helper/validate'
import convertToBase64 from '../helper/convert'
import '../styles/username.css'
import useFetch from '../hooks/fetch.hook'
import { updateUser } from '../helper/helper'

const Profile = () => {

  const [file, setFile] = useState()
  const [{ isLoading , apiData , serverError}] = useFetch()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || '',
      lastName: apiData?.lastName || '',
      email: apiData?.email || '',
      mobile: apiData?.mobile || '',
      address: apiData?.address || ''
    },
    enableReinitialize:true,
    validate: profileValidator,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = await Object.assign(values, { profile: file || apiData?.profile || '' })
      let updatePromise = updateUser(values)

      toast.promise(updatePromise , {
        loading:'Updating...',
        success: <b>Update Successfully...!</b>,
        error: <b>Could not Update!</b>
      })

    }
  })

  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0])
    setFile(base64)
    console.log(base64)
  }

  function userLogout(){
    localStorage.removeItem('token')
    navigate('/')
  }

  if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>
  if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

  return (
    <div className='container mx-auto'>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className='glass' style={{width:"fit-content" , margin:"0px 10px"}}>
          <div className="title flex flex-col items-center">
            <h4 className='text-3xl lg:text-4xl font-bold'>Profile</h4>
            <span className='pb-2 text-base 2xl:text-xl w-2/3 text-center text-gray-500'>You can update the details</span>
          </div>

          <form className='pt-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex flex-col items-center pb-2 2xl:py-4'>
              <label htmlFor='profile'>
                <img src={apiData?.profile || avatar} className='profile_img' alt="avatar" />
              </label>
              <input onChange={onUpload} type="file" id="profile" name="profile" />
            </div>
            <div className='flex flex-col items-center gap-4 py-2 2xl:py-4'>
              <div className="name flex w-[90%] gap-4 ">
                <input type="text" {...formik.getFieldProps('firstName')} className='textbox' placeholder='FirstName' />
                <input type="text" {...formik.getFieldProps('lastName')} className='textbox' placeholder='LastName' />
              </div>

              <div className="name flex w-[90%] gap-4 ">
                <input type="text" {...formik.getFieldProps('mobile')} className='textbox' placeholder='Mobile No.' />
                <input type="text" {...formik.getFieldProps('email')} className='textbox' placeholder='Email' />
              </div>

              <div className="name flex w-[100%] items-center justify-center gap-4 ">
                <input type="text" {...formik.getFieldProps('address')} className='textbox' placeholder='Address' />
              </div>
              <div className="name flex w-[100%] items-center justify-center gap-4 ">
                <button type='submit' className="btn">Update</button>
              </div>

             
            </div>

            <div className='text-center py-4'>
              <span className='text-gray-500'>come back later?<Link className='text-red-500' to="/register" onClick={()=>userLogout()}>Logout</Link></span>
            </div>

          </form>

        </div>
      </div>
    </div>
  )
}

export default Profile