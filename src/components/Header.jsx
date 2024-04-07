import { useState, useEffect } from 'react'
import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Divider,
  Card,
  TextInput,
  Select,
  SelectItem,
  Dialog,
  DialogPanel,
  Button,
  Icon,
} from '@tremor/react'
import {
  RiSaveLine,
  RiUserSettingsLine,
  RiLogoutBoxRLine,
  RiCloseCircleLine,
  RiGroupLine,
  RiAddLine,
  RiShiningFill,
} from '@remixicon/react'
import { Link, useNavigate } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

const Header = (props) => {
  const { nickname, team_id, team_name, role, game_name, invite_code, invite_flag, team_logo } = props
  const [media, setMedia] = useState(team_logo)
  const [teamName, setTeamName] = useState(team_name)
  const [inviteFlag, setInviteFlag] = useState(invite_flag)
  const [inviteCode, setInviteCode] = useState(invite_code)
  const [isOpenPleaseFill, setIsOpenPleaseFill] = useState(false)
  const [isOpenSuccess, setIsOpenSuccess] = useState(false)
  const [isOpenError, setIsOpenError] = useState(false)
  const [member, setMember] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getMember()
  }, [])

  // const supabase = createClient(process.env.SUPABASE_URL, process.env.SERVICE_ROLE_KEY)
  const supabase = createClient(
    'https://pkeejyrcevjrgrgljqfw.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZWVqeXJjZXZqcmdyZ2xqcWZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMTgwMDA2MCwiZXhwIjoyMDI3Mzc2MDYwfQ.HcJ80sv2Xs7Q07R_qAQg4eS-1zOsXG4au8EMFMJpt3w'
  )

  const getMember = async () => {
    try {
      const responseMember = await fetch(
        'https://scrim-api-production.up.railway.app/team/member/team-id/' + localStorage.getItem('team_id')
      )
      if (responseMember.ok) {
        const dataMember = await responseMember.json()
        setMember(dataMember.members)
        console.log('Load Member successful', dataMember)
      } else {
        console.error('Load Member failed', responseMember)
      }
    } catch (error) {
      console.error('Error occurred while Load Member in:', error)
    }
  }

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

  const handleKick = async (userId) => {
    const jsonData = {
      user_id: userId,
    }
    console.log('kick', jsonData)
    try {
      const responseKick = await fetch('https://scrim-api-production.up.railway.app/kick-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      })
      if (responseKick.ok) {
        getMember()
        setIsOpenSuccess(true)
        console.log('Kick successful', userId)
      } else {
        setIsOpenError(true)
        console.error('Kick failed', userId)
      }
    } catch (error) {
      setIsOpenError(true)
      console.error('Error occurred while Kick in:', error)
    }
  }

  const handleChangeRole = async (userId, roleToChange) => {
    const jsonData = {
      user_id: userId,
      role: roleToChange,
    }
    console.log('Change Role', jsonData)
    try {
      const responseChangeRole = await fetch('https://scrim-api-production.up.railway.app/change-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      })

      if (responseChangeRole.ok) {
        getMember()
        setIsOpenSuccess(true)
        console.log('ChangeRole successful', userId)
      } else {
        setIsOpenError(true)
        console.error('ChangeRole failed', userId)
      }
    } catch (error) {
      setIsOpenError(true)
      console.error('Error occurred while ChangeRole in:', error)
    }
  }

  const handleCreateATeam = async () => {
    navigate('/create-a-team')
  }

  const handleJoinATeam = async () => {
    navigate('/join-a-team')
  }

  const handleGenerateCode = async () => {
    try {
      const responseInviteCode = await fetch('https://scrim-api-production.up.railway.app/team/invite-code/team-id/' + team_id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (responseInviteCode.ok) {
        const dataInviteCode = await responseInviteCode.json()
        setInviteFlag(true)
        setInviteCode(dataInviteCode.invite_code)
        console.log('Update successful', teamName)
        // navigate('/home')
      } else {
        // setIsOpenError(true)
        console.error('Update failed', responseInviteCode)
      }
    } catch (error) {
      // setIsOpenError(true)
      console.error('Error occurred while Update in:', error)
    }
  }

  const handleUpdate = async () => {
    if (!teamName) {
      console.error('Please fill in team name fields.')
      setIsOpenPleaseFill(true)
      return
    }

    const jsonData = {
      team_id: parseInt(team_id),
      team_name: teamName,
      team_logo: media,
    }
    console.log(jsonData)
    try {
      const response = await fetch('https://scrim-api-production.up.railway.app/team', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      })
      if (response.ok) {
        localStorage.setItem('team_name', teamName)
        localStorage.setItem('team_logo', media)
        setIsOpenSuccess(true)
        console.log('Update successful', teamName)
      } else {
        setIsOpenError(true)
        console.error('Update failed', response)
      }
    } catch (error) {
      setIsOpenError(true)
      console.error('Error occurred while Update in:', error)
    }
  }

  let memberComponent = member.map((item, index) => {
    let changeRoleDropdown = (
      <Select defaultValue={item.role} value={item.role} onValueChange={(e) => handleChangeRole(item.user_id, e)}>
        <SelectItem value='Manager'>Manager</SelectItem>
        <SelectItem value='Player'>Player</SelectItem>
      </Select>
    )

    return (
      <TableRow key={index}>
        <TableCell>{item.nickname}</TableCell>
        <TableCell>{item.role}</TableCell>
        <TableCell>{changeRoleDropdown}</TableCell>
        <TableCell>
          <Button variant='light'>
            <Icon icon={RiCloseCircleLine} onClick={() => handleKick(item.user_id)} variant='simple' tooltip='Kick' color='red' />
          </Button>
        </TableCell>
      </TableRow>
    )
  })

  let scrimComponent = member.map((item, index) => {
    return (
      <TableRow key={index}>
        <TableCell>
          <img
            src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAcChzAxvZSCvQcxIAeHIiVw7u9_JNZriit8Utcr63gw&s'
            className='h-4 w-4 rounded-full me-2'
          />
        </TableCell>
        <TableCell>{item.role}</TableCell>
        <TableCell>Lotus</TableCell>
        <TableCell>2024-04-02</TableCell>
        <TableCell>02:00:00</TableCell>
        <TableCell>
          <Button onClick={() => handleKick(item.user_id)}>Accept Offer</Button>
        </TableCell>
        <TableCell>
          <Button variant='light'>
            <Icon icon={RiCloseCircleLine} onClick={() => handleKick(item.user_id)} variant='simple' tooltip='Kick' color='red' />
          </Button>
        </TableCell>
      </TableRow>
    )
  })

  let teamComponent
  if (team_id == 'null') {
    teamComponent = (
      <>
        <Card className='mx-auto max-w-2xl'>
          <h1 className='text-2xl font-bold'>Scrim Search</h1>
          <p className='mt-2 text-gray-600'>This is an example dashboard using Tailwind CSS.</p>
          <div className='grid grid-flow-col justify-stretch mt-6'>
            <div className='text-center'>
              <Button icon={RiAddLine} color='purple' onClick={() => handleCreateATeam()}>
                CREATE A TEAM
              </Button>
            </div>
            <div className='text-center'>
              <Button icon={RiGroupLine} color='purple' onClick={() => handleJoinATeam()}>
                JOIN A TEAM
              </Button>
            </div>
          </div>
          <p className='text-center text-slate-400'>Card</p>
        </Card>
      </>
    )
  } else {
    if (role == 'Manager') {
      teamComponent = (
        <>
          <Card className='mx-auto max-w-2xl'>
            <h1 className='text-2xl font-bold'>Team</h1>
            <p className='mt-2 text-gray-600'>This is an example dashboard using Tailwind CSS.</p>
            <TabGroup>
              <TabList className='mt-4'>
                <Tab>Team Settings</Tab>
                <Tab>Members</Tab>
                <Tab>Manage Scrim</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <p className='mt-4 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore
                    magna aliquyam erat.
                  </p>
                  <div className='grid grid-flow-col justify-stretch mt-6'>
                    <div className='items-center'>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Team Name</label>
                      <TextInput value={teamName} onChange={(e) => setTeamName(e.target.value)} />
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Team ID</label>
                      <TextInput disabled={true} value={team_id} />
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Game</label>
                      <TextInput disabled={true} value={game_name} />
                      <div className='mb-4'>
                        <input type='file' onChange={(e) => handleUploadImage(e)} />
                        {media && (
                          <img
                            src={`https://pkeejyrcevjrgrgljqfw.supabase.co/storage/v1/object/public/images/${media}`}
                            className='w-24 h-24 mt-4'
                          />
                        )}
                      </div>
                    </div>
                    <div className='text-center'>
                      <Button className='mb-2' disabled={inviteFlag} icon={RiGroupLine} color='purple' onClick={() => handleGenerateCode()}>
                        CREATE INVITE CODE
                      </Button>
                      {inviteFlag === true && <TextInput disabled={true} value={inviteCode} />}
                    </div>
                  </div>
                  <div className='grid grid-flow-col justify-stretch mt-6'>
                    <div className='text-center'></div>
                    <div className='text-end'>
                      <Button icon={RiSaveLine} color='purple' onClick={() => handleUpdate()}>
                        SAVE TEAM INFO
                      </Button>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <p className='mt-4 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>Members Detail</p>
                  <div className='mx-auto max-w-md'>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeaderCell>Nickname</TableHeaderCell>
                          <TableHeaderCell>Role</TableHeaderCell>
                          <TableHeaderCell>Change Role</TableHeaderCell>
                          <TableHeaderCell>Kick</TableHeaderCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>{memberComponent}</TableBody>
                    </Table>
                  </div>
                </TabPanel>
                <TabPanel>
                  <p className='mt-4 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>
                    Manage Scrim Detail
                  </p>
                  <div className=''>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeaderCell>Logo</TableHeaderCell>
                          <TableHeaderCell>Team Name</TableHeaderCell>
                          <TableHeaderCell>Map</TableHeaderCell>
                          <TableHeaderCell>Date</TableHeaderCell>
                          <TableHeaderCell>Time</TableHeaderCell>
                          <TableHeaderCell>Action</TableHeaderCell>
                          <TableHeaderCell>Cancel</TableHeaderCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>{scrimComponent}</TableBody>
                    </Table>
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>

            <p className='text-center text-slate-400'>Card</p>
          </Card>
        </>
      )
    } else {
      teamComponent = (
        <>
          <h1 className='text-2xl font-bold'>Welcome to my dashboard!</h1>
          <p className='mt-2 text-gray-600'>This is Player.</p>
        </>
      )
    }
  }

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
    console.log('Logout successful')
    navigate('/')
  }
  return (
    <div className='flex h-screen bg-gray-100'>
      <Dialog open={isOpenPleaseFill} onClose={(val) => setIsOpenPleaseFill(val)} static={true}>
        <DialogPanel>
          <h3 className='text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong'>
            Please fill in team name field.
          </h3>
          <p className='mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>
            Please fill in team name field.
          </p>
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
          <p className='mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>Email already exist.</p>
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
            <Link to='/home' className='flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700'>
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
          {teamComponent}
          <Divider>
            <Icon icon={RiShiningFill} variant='simple' tooltip='Scrim' size='xs' color='gray-400' />
          </Divider>
        </div>
      </div>
    </div>
  )
}

export default Header
