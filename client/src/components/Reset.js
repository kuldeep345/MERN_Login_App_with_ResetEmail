import React from 'react'
import { Link } from 'react-router-dom'
import avatar from './assets/profile.png'
import { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { resetPasswordValidation } from '../helper/validate'
import '../styles/username.css'

const Reset = () => {

  const formik = useFormik({
    initialValues:{
      password:"",
      confirm_pwd:""
    },
    validate:resetPasswordValidation,
    validateOnBlur:false,
    validateOnChange:false,
    onSubmit : async values =>{
      console.log(values)
    }
  })

  return (
    <div className='container mx-auto'>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
        <div className="flex justify-center items-center h-screen">
          <div className='glass'>
          <div className="title flex flex-col items-center">
              <h4 className='text-3xl lg:text-4xl 2xl:text-5xl font-bold'>Reset</h4>
              <span className='py-2 2xl:py-4 text-base 2xl:text-xl w-2/3 text-center text-gray-500'>Enter new password.</span>
          </div>

          <form className='py-10' onSubmit={formik.handleSubmit}>
        
            <div className='flex flex-col items-center gap-4 py-2 2xl:py-4'>
              <input type="text" {...formik.getFieldProps('password')} className='textbox' placeholder='New Password'/>
              <input type="text" {...formik.getFieldProps('confirm_pwd')} className='textbox' placeholder='Repeat Password'/>
              <button type='submit' className='btn'>Sign In</button>
            </div>

          </form>

          </div>
        </div>
    </div>
  )
}

export default Reset