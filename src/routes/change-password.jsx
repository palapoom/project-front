import { useState } from 'react'
import { Button, TextInput, Dialog, DialogPanel } from '@tremor/react'
import { Link } from 'react-router-dom'

function ChangePassword() {
  const [email, setEmail] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [isOpenDialog, setIsOpenDialog] = useState(false)

  const handleClear = async () => {
    setEmail('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!email) {
      console.error('Please email in all fields.')
      setErrMsg('Please email in all fields.')
      setIsOpenDialog(true)
      return
    }

    const jsonData = {
      email: email,
    }
    console.log(jsonData)
    try {
      const response = await fetch('https://scrim-api-production.up.railway.app/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      })
      const data = await response.json()
      if (response.ok) {
        setErrMsg(
          <>
            {data.error_msg} <br />
            <Link
              to='/'
              className='text-indigo-500 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              Login
            </Link>
          </>
        )
        setIsOpenDialog(true)
        console.log('Forgot-password successful', response)
      } else {
        setErrMsg(data.error_msg)
        setIsOpenDialog(true)
        console.error('Forgot-password failed', response)
      }
    } catch (error) {
      setErrMsg('Error occurred while Forgot-password.')
      setIsOpenDialog(true)
      console.error('Error occurred while Forgot-password in:', error)
    }
  }
  return (
    <>
      <div className='min-h-screen flex items-center justify-center w-full'>
        <Dialog open={isOpenDialog} onClose={(val) => setIsOpenDialog(val)} static={true}>
          <DialogPanel>
            <h3 className='text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong'>Forgot Password.</h3>
            <p className='mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>{errMsg}</p>
            <Button
              className='mt-8 w-full'
              onClick={() => {
                setIsOpenDialog(false)
                handleClear()
              }}
            >
              Got it!
            </Button>
          </DialogPanel>
        </Dialog>
        <div className='bg-white bg-gray-900 shadow-md rounded-lg px-8 py-6 max-w-md'>
          <h1 className='text-2xl font-bold text-center mb-4 text-gray-950'>Change Password</h1>
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                Email Address
              </label>
              <TextInput type='email' placeholder='your@email.com' value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className='flex items-center justify-between mb-4'>
              <p className='text-xs text-center text-slate-400'>Remember?</p>
              <Link
                to='/'
                className='text-xs text-indigo-500 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                Login
              </Link>
            </div>
            <Button
              type='submit'
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}

export default ChangePassword
