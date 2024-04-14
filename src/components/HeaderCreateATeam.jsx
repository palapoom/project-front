import { useState, useEffect } from 'react'
import { Divider, Card, TextInput, Select, SelectItem, Dialog, DialogPanel, Button, Icon } from '@tremor/react'
import { RiUserSettingsLine, RiLogoutBoxRLine, RiGroupLine, RiShiningFill, RiArrowRightLine } from '@remixicon/react'
import { Link, useNavigate } from 'react-router-dom'
import valorant from '../assets/valorant.svg'
import counterstrike2 from '../assets/counterstrike2.svg'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

const HeaderCreateATeam = (props) => {
  const { user_id, nickname, team_id, team_name, role, game_id, game_name, invite_code, invite_flag } = props
  const [teamName, setTeamName] = useState('')
  const [gameId, setGameId] = useState(game_id)
  const [media, setMedia] = useState('')
  const [isOpenPleaseFill, setIsOpenPleaseFill] = useState(false)
  const [isOpenSuccess, setIsOpenSuccess] = useState(false)
  const [isOpenError, setIsOpenError] = useState(false)
  const navigate = useNavigate()

  const supabase = createClient(
    'https://pkeejyrcevjrgrgljqfw.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZWVqeXJjZXZqcmdyZ2xqcWZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMTgwMDA2MCwiZXhwIjoyMDI3Mzc2MDYwfQ.HcJ80sv2Xs7Q07R_qAQg4eS-1zOsXG4au8EMFMJpt3w'
  )

  const handleUploadImage = async (e) => {
    let file = e.target.files[0]
    const fileName = uuidv4()

    const { data, error } = await supabase.storage.from('images').upload('/' + fileName, file)

    if (data) {
      setMedia(fileName)
    } else {
      console.log(error)
    }
  }

  const handleCreateATeam = async () => {
    if (!teamName || !media) {
      console.error('Please fill in all fields.')
      setIsOpenPleaseFill(true)
      return
    }

    const jsonData = {
      team_name: teamName,
      team_logo: media,
      game_id: parseInt(gameId),
    }
    console.log(jsonData)
    try {
      const response = await fetch('https://scrim-api-production.up.railway.app/team/create/user-id/' + user_id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      })
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('role', 'Manager')
        // ขอ respone team_id, invite_code, invite_flag
        localStorage.setItem('team_id', data.team_id)
        localStorage.setItem('team_name', teamName)
        setIsOpenSuccess(true)
        console.log('Create successful', teamName)
        navigate('/home')
      } else {
        setIsOpenError(true)
        console.error('Create failed', response)
      }
    } catch (error) {
      setIsOpenError(true)
      console.error('Error occurred while Create in:', error)
    }
  }

  let joinATeamComponent = (
    <>
      <Card className='mx-auto'>
        <h1 className='text-2xl font-bold'>Create a Team</h1>
        <p className='mt-2 text-gray-600'>Basic Details.</p>
        <div className='grid grid-flow-col justify-stretch mt-6'>
          <div>
            <div className='mb-4'>
              <label htmlFor='nickname' className='block text-sm font-medium text-gray-700 mb-2'>
                Team Name
              </label>
              <TextInput
                className='mb-4'
                placeholder='Enter your team name'
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </div>
            <div className='mb-4'>
              <label htmlFor='gameId' className='block text-sm font-medium text-gray-700 mb-2'>
                Game
              </label>
              <Select disabled defaultValue={gameId} value={gameId} onValueChange={(e) => setGameId(e)}>
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
            <div className='mb-4'>
              <input type='file' onChange={(e) => handleUploadImage(e)} />
              {media && (
                <img src={`https://pkeejyrcevjrgrgljqfw.supabase.co/storage/v1/object/public/images/${media}`} className='w-24 h-24 mt-4' />
              )}
            </div>
            <div className='text-center'>
              <Button icon={RiArrowRightLine} color='purple' onClick={() => handleCreateATeam()}>
                CREATE
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </>
  )

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
            Please fill in all field.
          </h3>
          <p className='mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>Please fill in all field.</p>
          <Button className='mt-8 w-full' onClick={() => setIsOpenPleaseFill(false)}>
            Got it!
          </Button>
        </DialogPanel>
      </Dialog>
      <Dialog open={isOpenSuccess} onClose={(val) => setIsOpenSuccess(val)} static={true}>
        <DialogPanel>
          <h3 className='text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong'>Success.</h3>
          <p className='mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>Update successfuly.</p>
          <Button className='mt-8 w-full' onClick={() => setIsOpenSuccess(false)}>
            Got it!
          </Button>
        </DialogPanel>
      </Dialog>
      <Dialog open={isOpenError} onClose={(val) => setIsOpenError(val)} static={true}>
        <DialogPanel>
          <h3 className='text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong'>Error.</h3>
          <p className='mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>Created Error.</p>
          <Button className='mt-8 w-full' onClick={() => setIsOpenError(false)}>
            Got it!
          </Button>
        </DialogPanel>
      </Dialog>
      <div className='hidden md:flex flex-col w-64 bg-gray-800'>
        <div className='flex items-center justify-center h-16 bg-gray-900'>
          <span className='text-white font-bold uppercase'>Scrim</span>
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
            <Icon icon={RiShiningFill} variant='simple' tooltip='Scrim' size='xs' color='gray-400' />
          </Divider>
        </div>
      </div>
    </div>
  )
}

export default HeaderCreateATeam
