import React, { useEffect } from 'react'
import { Link , useNavigate} from 'react-router-dom'
import avatar from './assets/profile.png'
import { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { usernameValidate } from '../helper/validate'
import '../styles/username.css'
import { useAuthStore } from '../store/store'

const Username = () => {

   const setUsername = useAuthStore(state => state.setUsername)
   const navigate = useNavigate()
  

  const formik = useFormik({
    initialValues:{
      username:""
    },
    validate:usernameValidate,
    validateOnBlur:false,
    validateOnChange:false,
    onSubmit : async values =>{
      setUsername(values.username)
      navigate('/password')
    }
  })

  return (
    <div className='container mx-auto'>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
        <div className="flex justify-center items-center h-screen">
          <div className='glass'>
          <div className="title flex flex-col items-center">
              <h4 className='text-3xl lg:text-4xl font-bold'>Hello again!</h4>
              <span className='py-2 2xl:py-4 text-base 2xl:text-xl w-2/3 text-center text-gray-500'>Explore More by connecting with Us</span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-2 2xl:py-4'>
                <img src={avatar} className='profile_img' alt="avatar"/>
            </div>

            <div className='flex flex-col items-center gap-4 py-2 2xl:py-4'>
              <input type="text" {...formik.getFieldProps('username')} className='textbox' placeholder='Username'/>
              <button type='submit' className='btn'>Let's Go</button>
            </div>

            <div className='text-center py-4'>
              <span className='text-gray-500'>Not a Member <Link className='text-red-500' to="/register">Register</Link></span>
            </div>

          </form>

          </div>
        </div>
    </div>
  )
}

export default Username