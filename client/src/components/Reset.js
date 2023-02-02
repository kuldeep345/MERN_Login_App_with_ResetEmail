import React, { useEffect } from 'react'
import { toast , Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { resetPasswordValidation } from '../helper/validate'
import { resetPassword } from '../helper/helper'
import { useAuthStore } from '../store/store'
import { useNavigate , Navigate } from 'react-router-dom'
import useFetch from '../hooks/fetch.hook'
import '../styles/username.css'

const Reset = () => {

  const { username } = useAuthStore(state => state.auth)
  const navigate = useNavigate()
  const [{ isLoading , apiData , status , serverError }] = useFetch('createResetSession')
 
  const formik = useFormik({
    initialValues:{
      password:"",
      confirm_pwd:""
    },
    validate:resetPasswordValidation,
    validateOnBlur:false,
    validateOnChange:false,
    onSubmit : async values =>{
      let resetPromise = resetPassword({ username , password:values.password})
      toast.promise(resetPromise , {
        loading:'Updating...',
        success:<b>Reset Successfully...!</b>,
        error:<b>Could not Reset!</b>
      })

      resetPromise.then(function(){ navigate('/password') })
    }
  })

  if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>
  if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>
  if(status && status !== 201) return <Navigate to={'/password'} replace={true}></Navigate>

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