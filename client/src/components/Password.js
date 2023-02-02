import React from 'react'
import { Link , useNavigate } from 'react-router-dom'
import avatar from './assets/profile.png'
import {toast , Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { passwordValidate } from '../helper/validate'
import '../styles/username.css'
import useFetch from '../hooks/fetch.hook'
import { useAuthStore } from '../store/store'
import { verifyPassword } from '../helper/helper'

const Password = () => {

  const { username } = useAuthStore(state => state.auth)
  const [{ isLoading , apiData , serverError}] = useFetch(`user/${username}`)

  console.log( isLoading , apiData , serverError)

  const navigate = useNavigate()

  const formik = useFormik({
    initialValues:{
      password:""
    },
    validate:passwordValidate,
    validateOnBlur:false,
    validateOnChange:false,
    onSubmit : async values =>{
      let loginPromise = verifyPassword({ username , password:values.password })

      toast.promise(loginPromise , {
        loading:'Checking...',
        success: <b>Login Successfully...!</b>,
        error:<b>Password Not Match!</b>
      });

      loginPromise.then(res => {
        let { token } = res.data;
        localStorage.setItem('token' , token)
        navigate('/profile')
      })
    }
  })

  if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>
  if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

  return (
    <div className='container mx-auto'>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
        <div className="flex justify-center items-center h-screen">
          <div className='glass'>
          <div className="title flex flex-col items-center">
              <h4 className='text-3xl lg:text-4xl font-bold'>Hello {apiData?.firstName || apiData?.username}</h4>
              <span className='py-2 2xl:py-4 text-base 2xl:text-xl w-2/3 text-center text-gray-500'>Explore More by connecting with Us</span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-2'>
                <img src={apiData?.profile || avatar} className='profile_img' alt="avatar"/>
            </div>

            <div className='flex flex-col items-center gap-4 py-2 2xl:py-4'>
              <input type='password' {...formik.getFieldProps('password')} className='textbox'  placeholder='Password'/>
              <button type='submit' className='btn'>Sign In</button>
            </div>

            <div className='text-center py-4'>
              <span className='text-gray-500'>Forgot Password?<Link className='text-red-500' to="/recovery">Recover Now</Link></span>
            </div>

          </form>

          </div>
        </div>
    </div>
  )
}

export default Password