import { useState } from 'react'
import { Divider, Card, TextInput, Dialog, DialogPanel, Button, Icon } from '@tremor/react'
import { RiUserSettingsLine, RiLogoutBoxRLine, RiGroupLine, RiShiningFill, RiArrowRightLine } from '@remixicon/react'
import { Link, useNavigate } from 'react-router-dom'

const HeaderJoinATeam = (props) => {
  const { user_id, nickname } = props
  const [inviteCode, setInviteCode] = useState('')
  const [isOpenPleaseFill, setIsOpenPleaseFill] = useState(false)
  const [isOpenSuccess, setIsOpenSuccess] = useState(false)
  const [isOpenError, setIsOpenError] = useState(false)
  const navigate = useNavigate()

  const handleHome = async () => {
    navigate('/home')
  }

  const handleJoinATeam = async () => {
    if (!inviteCode) {
      console.error('Please fill in invite code fields.')
      setIsOpenPleaseFill(true)
      return
    }

    const jsonData = {
      invite_code: inviteCode,
      user_id: user_id,
    }
    console.log(jsonData)
    try {
      const response = await fetch('https://scrim-api-production.up.railway.app/team/join', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      })
      if (response.ok) {
        const dataJoin = await response.json()
        localStorage.setItem('team_id', dataJoin.team_id)
        localStorage.setItem('team_name', dataJoin.team_name)
        localStorage.setItem('team_logo', dataJoin.team_logo)
        localStorage.setItem('invite_flag', dataJoin.invite_flag)
        localStorage.setItem('invite_code', dataJoin.invite_code)
        setIsOpenSuccess(true)
        console.log('Join successful')
      } else {
        setIsOpenError(true)
        console.error('Join failed', response)
      }
    } catch (error) {
      setIsOpenError(true)
      console.error('Error occurred while Join in:', error)
    }
  }

  let joinATeamComponent = (
    <>
      <Card className='mx-auto'>
        <h1 className='text-2xl font-bold'>Join a Team</h1>
        <div className='grid grid-flow-col justify-stretch mt-6'>
          <div className='text-center'>
            <label htmlFor='nickname' className='block text-sm font-medium text-gray-700 mb-2'>
              Invite Code
            </label>
            <TextInput
              className='mb-4'
              placeholder='Enter your invite code'
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
            />
            <Button icon={RiArrowRightLine} color='purple' onClick={() => handleJoinATeam()}>
              NEXT
            </Button>
          </div>
        </div>
      </Card>
    </>
  )

  // props
  const handleSignOut = async () => {
    localStorage.removeItem('email')
    localStorage.removeItem('game_id')
    localStorage.removeItem('game_name')
    localStorage.removeItem('nickname')
    localStorage.removeItem('phone_number')
    localStorage.removeItem('role')
    localStorage.removeItem('team_id')
    localStorage.removeItem('team_name')
    localStorage.removeItem('user_name')
    localStorage.removeItem('invite_code')
    localStorage.removeItem('invite_flag')
    localStorage.removeItem('team_logo')
    console.log('Logout successful')
    navigate('/')
  }
  return (
    <div className='flex h-screen bg-gray-100'>
      <Dialog open={isOpenPleaseFill} onClose={(val) => setIsOpenPleaseFill(val)} static={true}>
        <DialogPanel>
          <h3 className='text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong'>
            Please fill in invite code field.
          </h3>
          <p className='mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>
            Please fill in invite code field.
          </p>
          <Button className='mt-8 w-full' onClick={() => setIsOpenPleaseFill(false)}>
            Got it!
          </Button>
        </DialogPanel>
      </Dialog>
      <Dialog open={isOpenSuccess} onClose={(val) => setIsOpenSuccess(val)} static={true}>
        <DialogPanel>
          <h3 className='text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong'>Success.</h3>
          <p className='mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>Join Successfully.</p>
          <Button className='mt-8 w-full' onClick={() => handleHome()}>
            Got it!
          </Button>
        </DialogPanel>
      </Dialog>
      <Dialog open={isOpenError} onClose={(val) => setIsOpenError(val)} static={true}>
        <DialogPanel>
          <h3 className='text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong'>Error.</h3>
          <p className='mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>Invite Code is not exist.</p>
          <Button className='mt-8 w-full' onClick={() => setIsOpenError(false)}>
            Got it!
          </Button>
        </DialogPanel>
      </Dialog>
      <div className='hidden md:flex flex-col w-64 bg-gray-800'>
        <div className='flex items-center justify-center h-16 bg-gray-900'>
          <span className='text-white font-bold uppercase'>WeScrim</span>
        </div>
        <div className='flex flex-col flex-1 overflow-y-auto'>
          <nav className='flex-1 px-2 py-4 bg-gray-800'>
            <p className='flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700'>{nickname}</p>
            <Link to='/home' className='flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700'>
              <Icon className='h-6 w-6 mr-2' icon={RiGroupLine} variant='simple' tooltip='Team' color='white' />
              Team
            </Link>
            <Link to='/settings' className='flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700'>
              <Icon className='h-6 w-6 mr-2' icon={RiUserSettingsLine} variant='simple' tooltip='Settings' color='white' />
              Settings
            </Link>
            <a onClick={handleSignOut} className='flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700 cursor-pointer'>
              <Icon className='h-6 w-6 mr-2' icon={RiLogoutBoxRLine} variant='simple' tooltip='Sign Out' color='white' />
              Sign Out
            </a>
          </nav>
        </div>
      </div>

      <div className='flex flex-col flex-1 overflow-y-auto'>
        <div className='flex items-center justify-between h-16 bg-white border-b border-gray-200'>
          <div className='flex items-center px-4'>
            <button className='text-gray-500 focus:outline-none focus:text-gray-700'>
              <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16' />
              </svg>
            </button>
          </div>
          <div className='flex items-center pr-4'>
            <button className='flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700'>
              <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 19l-7-7 7-7m5 14l7-7-7-7' />
              </svg>
            </button>
          </div>
        </div>
        <div className='p-4'>
          {joinATeamComponent}
          <Divider>
            <Icon icon={RiShiningFill} variant='simple' tooltip='WeScrim' size='xs' color='gray-400' />
          </Divider>
        </div>
      </div>
    </div>
  )
}

export default HeaderJoinATeam
