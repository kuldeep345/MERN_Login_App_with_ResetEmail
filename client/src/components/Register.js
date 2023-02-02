import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import avatar from './assets/profile.png'
import { toast, Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { registerValidation } from '../helper/validate'
import convertToBase64 from '../helper/convert'
import '../styles/username.css'
import { registerUser } from '../helper/helper'
import { useNavigate } from 'react-router-dom'

const Register = () => {

  const [file , setFile] = useState()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues:{
      email:"",
      username:"",
      password:""
    },
    validate:registerValidation,
    validateOnBlur:false,
    validateOnChange:false,
    onSubmit : async values =>{
      values = await Object.assign(values, { profile : file || ''})
      let registerPromise = registerUser(values)
      toast.promise(registerPromise , {
        loading:'Creating',
        success:<b>Register Successfully</b>,
        error:<b>Could not Register</b>
      });
      registerPromise.then(()=>navigate('/'))
    }
  })

  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0])
    setFile(base64)
  }

  return (
    <div className='container mx-auto'>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
        <div className="flex justify-center items-center h-screen">
          <div className='glass'>
          <div className="title flex flex-col items-center">
              <h4 className='text-3xl lg:text-4xl font-bold'>Register</h4>
              <span className='pb-2 text-base 2xl:text-xl w-2/3 text-center text-gray-500'>Happy to join you!</span>
          </div>

          <form className='pt-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex flex-col items-center pb-2 2xl:py-4'>
              <label htmlFor='profile'>
                <img src={file || avatar} className='profile_img' alt="avatar"/>
              </label>
            <input onChange={onUpload} type="file" id="profile" name="profile" />
            </div>
            <div className='flex flex-col items-center gap-4 py-2 2xl:py-4'>
              <input type="text" {...formik.getFieldProps('email')} className='textbox' placeholder='Email'/>
              <input type="text" {...formik.getFieldProps('username')} className='textbox' placeholder='Username'/>
              <input type="text" {...formik.getFieldProps('password')} className='textbox' placeholder='Password'/>
              <button type='submit' className='btn'>Sign Up</button>
            </div>

            <div className='text-center py-4'>
              <span className='text-gray-500'>Already Registered?<Link className='text-red-500' to="/">Login Now</Link></span>
            </div>

          </form>

          </div>
        </div>
    </div>
  )
}

export default Register