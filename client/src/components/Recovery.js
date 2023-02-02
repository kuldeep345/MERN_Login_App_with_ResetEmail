import React, { useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { useAuthStore } from '../store/store'
import '../styles/username.css'
import { generateOTP, verifyOTP } from '../helper/helper'
import { useNavigate } from 'react-router-dom'

const Password = () => {

  const { username } = useAuthStore(state => state.auth)
  const [OTP , setOTP] = useState()
  const navigate = useNavigate()
  let shouldLog = true
  useEffect(() => {
    if(shouldLog){
      shouldLog = false
      generateOTP(username).then((OTP) => {
        console.log(OTP)
        if(OTP) return toast.success('OTP has been send to your email')
        return toast.error('Problem while generating OTP!')
      })
    }
    
  }, [username])
  
  const onSubmit = async(e)=>{
    e.preventDefault()
    try {
      let { status } = await verifyOTP({ username , code:OTP })
      if(status === 201){
        toast.success('Verify Successfully')
        return navigate('/reset')
      }
  
    } catch (error) {
      return toast.error('Wrong OTP! Check email again')
    }
  }

  function resendOTP(){
    let sendPromise = generateOTP(username)

    toast.promise(sendPromise , {
      loading:'Sending...',
      success:<b>OTP has been send to your email!</b>,
      error:<b>Could not Send it!</b>
    })

    sendPromise.then(OTP => {
      console.log(OTP)
    })

  }

  return (
    <div className='container mx-auto'>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
        <div className="flex justify-center items-center h-screen">
          <div className='glass'>
          <div className="title flex flex-col items-center">
              <h4 className='text-3xl lg:text-4xl font-bold'>Recovery</h4>
              <span className='py-2 text-sm 2xl:text-xl w-2/3 text-center text-gray-500 break-words'>Enter OTP to recover password</span>
          </div>

          <form className='pt-10' onSubmit={onSubmit}>

            <div className='flex flex-col items-center gap-4 py-2 2xl:py-4'>
                <div className="flex flex-col items-center input text-center">
                <span className='py-4 text-xs  text-gray-500 text-center'>
                    Enter 6 digit OTP send to your email address
                </span>
              <input type='text' onChange={(e)=>setOTP(e.target.value)} className='textbox'  placeholder='OTP'/>
                </div>
              <button type='submit' className='btn'>Sign In</button>
            </div>
          </form>

          <div className='text-center py-4'>
              <span className='text-gray-500'>Can't get OTP?<button onClick={resendOTP} className='text-red-500' to="/">Resent</button></span>
            </div>

          </div>
        </div>
    </div>
  )
}

export default Password