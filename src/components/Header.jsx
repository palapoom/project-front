import { useState, useEffect } from 'react'
import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Divider,
  Card,
  TextInput,
  List,
  ListItem,
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
  RiSearchLine,
  RiRefreshLine,
  RiCloseCircleLine,
  RiGroupLine,
  RiAddLine,
  RiShiningFill,
} from '@remixicon/react'
import { Link, useNavigate } from 'react-router-dom'

const Header = (props) => {
  const { nickname, team_id, team_name, role, game_name, invite_code, invite_flag } = props
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
    // event.preventDefault()

    if (!teamName) {
      console.error('Please fill in team name fields.')
      setIsOpenPleaseFill(true)
      return
    }

    const jsonData = {
      team_id: parseInt(team_id),
      team_name: teamName,
      // team_logo: "https://seeklogo.com/images/V/valorant-logo-FAB2CA0E55-seeklogo.com.png",
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
        setIsOpenSuccess(true)
        console.log('Update successful', teamName)
        // navigate('/home')
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
      <ListItem key={index}>
        <span>{item.nickname}</span>
        <span>{item.role}</span>
        <span>{changeRoleDropdown}</span>
        <span>
          <Button variant='light'>
            <Icon icon={RiCloseCircleLine} onClick={() => handleKick(item.user_id)} variant='simple' tooltip='Kick' color='red' />
          </Button>
        </span>
      </ListItem>
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
                    </div>
                    <div className='text-center'>
                      <Button className='mb-2' disabled={inviteFlag} icon={RiGroupLine} color='purple' onClick={() => handleGenerateCode()}>
                        CREATE INVITE CODE
                      </Button>
                      {inviteFlag === true && <TextInput disabled={true} value={inviteCode} />}
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <p className='mt-4 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>Members Detail</p>
                  <div className='mx-auto max-w-md'>
                    <ListItem>
                      <span>Nickname</span>
                      <span>Role</span>
                      <span>Change Role</span>
                      <span>Kick</span>
                    </ListItem>
                    <List>{memberComponent}</List>
                  </div>
                </TabPanel>
                <TabPanel>
                  <p className='mt-4 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>
                    Manage Scrim Detail
                  </p>
                </TabPanel>
              </TabPanels>
            </TabGroup>

            <div className='grid grid-flow-col justify-stretch mt-6'>
              <div className='text-center'></div>
              <div className='text-end'>
                <Button icon={RiSaveLine} color='purple' onClick={() => handleUpdate()}>
                  SAVE TEAM INFO
                </Button>
              </div>
            </div>
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
