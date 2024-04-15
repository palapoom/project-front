import { useState } from 'react'
import { TextInput, Select, SelectItem, Dialog, DialogPanel } from '@tremor/react'
import { Button } from '@tremor/react'
import { Link } from 'react-router-dom'
import valorant from '../assets/valorant.svg'
import counterstrike2 from '../assets/counterstrike2.svg'

function Register() {
  const [isOpenPleaseFill, setIsOpenPleaseFill] = useState(false)
  const [isOpenSuccess, setIsOpenSuccess] = useState(false)
  const [isOpenError, setIsOpenError] = useState(false)

  const [email, setEmail] = useState('')
  const [userPass, setUserPass] = useState('')
  const [nickname, setNickname] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [gameId, setGameId] = useState('1')

  const handleClear = async () => {
    setEmail('')
    setUserPass('')
    setNickname('')
    setPhoneNumber('')
    setGameId('1')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!email || !userPass || !nickname || !phoneNumber || !gameId) {
      console.error('Please fill in all fields')
      setIsOpenPleaseFill(true)
      return
    }

    const jsonData = {
      email: email,
      user_pass: userPass,
      nickname: nickname,
      phone_number: phoneNumber,
      game_id: parseInt(gameId),
    }
    console.log(jsonData)
    try {
      const response = await fetch('https://scrim-api-production.up.railway.app/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      })
      if (response.ok) {
        setIsOpenSuccess(true)
        console.log('Register successful', response)
      } else {
        setIsOpenError(true)
        console.error('Register failed', response)
      }
    } catch (error) {
      setIsOpenError(true)
      console.error('Error occurred while Register in:', error)
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
        <Dialog open={isOpenSuccess} onClose={(val) => setIsOpenSuccess(val)} static={true}>
          <DialogPanel>
            <h3 className='text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong'>Success.</h3>
            <p className='mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>Register Successfully.</p>
            <Button
              className='mt-8 w-full'
              onClick={() => {
                setIsOpenSuccess(false)
                handleClear()
              }}
            >
              Got it!
            </Button>
          </DialogPanel>
        </Dialog>
        <Dialog open={isOpenError} onClose={(val) => setIsOpenError(val)} static={true}>
          <DialogPanel>
            <h3 className='text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong'>Error.</h3>
            <p className='mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>Email already exist.</p>
            <Button className='mt-8 w-full' onClick={() => setIsOpenError(false)}>
              Got it!
            </Button>
          </DialogPanel>
        </Dialog>
        <div className='bg-white bg-gray-900 shadow-md rounded-lg px-8 py-6 max-w-md'>
          <h1 className='text-2xl font-bold text-center mb-4 text-gray-950'>Register to WeScrim!</h1>
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label htmlFor='nickname' className='block text-sm font-medium text-gray-700 mb-2'>
                Nickname
              </label>
              <TextInput placeholder='Enter your nickname' value={nickname} onChange={(e) => setNickname(e.target.value)} />
            </div>
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
            </div>
            <div className='mb-4'>
              <label htmlFor='phoneNumber' className='block text-sm font-medium text-gray-700 mb-2'>
                Phone Number
              </label>
              <TextInput
                type='tel'
                pattern='[0]{1}[0-9]{9}'
                placeholder='0987897655'
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className='mb-4'>
              <label htmlFor='gameId' className='block text-sm font-medium text-gray-700 mb-2'>
                Game
              </label>
              <Select defaultValue={gameId} value={gameId} onValueChange={(e) => setGameId(e)}>
                <SelectItem value='1'>
                  <div className='inline-flex items-center'>
                    <img src={valorant} className='h-4 w-4 rounded-full me-2' />
                    Valorant
                  </div>
                </SelectItem>
                <SelectItem value='2'>
                  <div className='inline-flex items-center'>
                    <img src={counterstrike2} className='h-4 w-4 rounded-full me-2' />
                    CSGO2
                  </div>
                </SelectItem>
              </Select>
            </div>
            <div className='flex items-center justify-between mb-4'>
              <p className='text-xs text-center text-slate-400'>Already register?</p>
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
              Register
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Register
