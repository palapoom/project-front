import { useState, useEffect } from 'react'
import { TextInput } from '@tremor/react'
import { Button, Dialog, DialogPanel } from '@tremor/react'
import { Link, useNavigate } from 'react-router-dom'

function App() {
  const navigate = useNavigate()

  useEffect(() => {
    const nicknameLogin = localStorage.getItem('nickname')
    if (nicknameLogin) {
      navigate('/home')
    }
  }, [navigate])

  const [isOpenPleaseFill, setIsOpenPleaseFill] = useState(false)
  const [isOpenError, setIsOpenError] = useState(false)

  const [email, setEmail] = useState('')
  const [userPass, setUserPass] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!email || !userPass) {
      console.error('Please fill in all fields')
      setIsOpenPleaseFill(true)
      return
    }

    const jsonData = {
      email: email,
      user_pass: userPass,
    }
    console.log(jsonData)
    try {
      const response = await fetch('https://scrim-api-production.up.railway.app/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      })
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('email', data.email)
        localStorage.setItem('game_id', data.game_id)
        localStorage.setItem('game_name', data.game_name)
        localStorage.setItem('nickname', data.nickname)
        localStorage.setItem('phone_number', data.phone_number)
        localStorage.setItem('role', data.role)
        localStorage.setItem('team_id', data.team_id)
        localStorage.setItem('team_name', data.team_name)
        localStorage.setItem('team_logo', data.team_logo)
        localStorage.setItem('user_name', data.user_name)
        console.log('Login successful', data)
        navigate('/home')
      } else {
        setIsOpenError(true)
        console.error('Login failed', response)
      }
    } catch (error) {
      setIsOpenError(true)
      console.error('Error occurred while Login in:', error)
    }
  }
  return (
    <>
      <div className='min-h-screen flex items-center justify-center w-full'>
        <Dialog open={isOpenPleaseFill} onClose={(val) => setIsOpenPleaseFill(val)} static={true}>
          <DialogPanel>
            <h3 className='text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong'>
              Please fill in all fields.
            </h3>
            <p className='mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>
              Please fill in all fields.
            </p>
            <Button className='mt-8 w-full' onClick={() => setIsOpenPleaseFill(false)}>
              Got it!
            </Button>
          </DialogPanel>
        </Dialog>
        <Dialog open={isOpenError} onClose={(val) => setIsOpenError(val)} static={true}>
          <DialogPanel>
            <h3 className='text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong'>Error.</h3>
            <p className='mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>
              Couldn't find your account.
            </p>
            <Button className='mt-8 w-full' onClick={() => setIsOpenError(false)}>
              Got it!
            </Button>
          </DialogPanel>
        </Dialog>
        <div className='shadow-md rounded-lg px-8 py-6 max-w-md'>
          <h1 className='text-2xl font-bold text-center mb-4 text-gray-950'>Welcome to WeScrim!</h1>
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                Email Address
              </label>
              <TextInput type='email' placeholder='your@email.com' value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className='mb-4'>
              <label htmlFor='userPass' className='block text-sm font-medium text-gray-700 mb-2'>
                Password
              </label>
              <TextInput type='password' placeholder='Enter your password' value={userPass} onChange={(e) => setUserPass(e.target.value)} />
              <Link
                to='/change-password'
                className='text-xs text-indigo-500 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                Forgot Password?
              </Link>
            </div>
            <div className='flex items-center justify-between mb-4'>
              <p className='text-xs text-center text-slate-400'>Don't Have an Account?</p>
              <Link
                to='/register'
                className='text-xs text-indigo-500 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                Create Account
              </Link>
            </div>
            <Button
              type='submit'
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}

export default App
