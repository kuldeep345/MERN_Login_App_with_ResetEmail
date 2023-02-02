import React from 'react'
import { Toaster } from 'react-hot-toast'
import '../styles/username.css'

const Password = () => {


  return (
    <div className='container mx-auto'>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
        <div className="flex justify-center items-center h-screen">
          <div className='glass'>
          <div className="title flex flex-col items-center">
              <h4 className='text-3xl lg:text-4xl font-bold'>Recovery</h4>
              <span className='py-2 text-sm 2xl:text-xl w-2/3 text-center text-gray-500 break-words'>Enter OTP to recover password</span>
          </div>

          <form className='pt-10'>

            <div className='flex flex-col items-center gap-4 py-2 2xl:py-4'>
                <div className="flex flex-col items-center input text-center">
                <span className='py-4 text-xs  text-gray-500 text-center'>
                    Enter 6 digit OTP send to your email address
                </span>
              <input type='text' className='textbox'  placeholder='OTP'/>
                </div>
              <button type='submit' className='btn'>Sign In</button>
            </div>

            <div className='text-center py-4'>
              <span className='text-gray-500'>Can't get OTP?<button className='text-red-500' to="/">Resent</button></span>
            </div>

          </form>

          </div>
        </div>
    </div>
  )
}

export default Password