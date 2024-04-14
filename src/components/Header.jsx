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
  DatePicker,
} from '@tremor/react'
import {
  RiDeleteBinLine,
  RiCloseLine,
  RiCheckLine,
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
  const { nickname, team_id, team_name, role, game_id, game_name, invite_code, invite_flag, team_logo } = props
  const [gameMap, setGameMap] = useState([])
  const [scrimDate, setScrimDate] = useState(undefined)
  const [scrimTime, setScrimTime] = useState('')
  const [scrimMap, setScrimMap] = useState()
  const [scrim, setScrim] = useState([]) // can mock
  const [scrimOffer, setScrimOffer] = useState([])
  const [media, setMedia] = useState(team_logo)
  const [teamName, setTeamName] = useState(team_name)
  const [inviteFlag, setInviteFlag] = useState(invite_flag == 'true')
  const [inviteCode, setInviteCode] = useState(invite_code)
  const [selectedMapType, setSelectedMapType] = useState('all')
  const [selectedMaps, setSelectedMaps] = useState([])
  const [isOpenPleaseFill, setIsOpenPleaseFill] = useState(false)
  const [isOpenSuccess, setIsOpenSuccess] = useState(false)
  const [isOpenError, setIsOpenError] = useState(false)
  const [isOpenPostScrim, setIsOpenPostScrim] = useState(false)
  const [isOpenTeamBattle, setIsOpenTeamBattle] = useState(false)
  const [isOpenTeamBattleMatch, setIsOpenTeamBattleMatch] = useState(false)
  const [teamBattle, setTeamBattle] = useState([undefined])
  const [member, setMember] = useState([])
  const [matches, setMatches] = useState([])
  const [matchButton, setMatchButton] = useState(() => (
    <div className='flex items-center'>
      <Button className='mt-8 w-full' onClick={() => setIsOpenTeamBattleMatch(false)}>
        Got it!
      </Button>
    </div>
  ))
  const navigate = useNavigate()

  useEffect(() => {
    getGameMap()
    getMember()
    getScrim()
    getScrimOffer()
    getMatches()
  }, [])

  // const supabase = createClient(process.env.SUPABASE_URL, process.env.SERVICE_ROLE_KEY)
  const supabase = createClient(
    'https://pkeejyrcevjrgrgljqfw.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZWVqeXJjZXZqcmdyZ2xqcWZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMTgwMDA2MCwiZXhwIjoyMDI3Mzc2MDYwfQ.HcJ80sv2Xs7Q07R_qAQg4eS-1zOsXG4au8EMFMJpt3w'
  )

  const getMatches = async () => {
    try {
      const responseMatches = await fetch(`https://scrim-api-production.up.railway.app/scrim/match/team-id/${team_id}`)
      if (responseMatches.ok) {
        const dataMatches = await responseMatches.json()
        if (dataMatches.scrims) {
          setMatches(dataMatches.scrims)
        } else {
          setMatches([])
        }
        console.log('Load Matches successful', dataMatches)
      } else {
        console.error('Load Matches failed', responseMatches)
      }
    } catch (error) {
      console.error('Error occurred while Load Matches in:', error)
    }
  }

  const getGameMap = async () => {
    try {
      const responseGameMap = await fetch(`https://scrim-api-production.up.railway.app/game/game-id/${game_id}/map`)
      if (responseGameMap.ok) {
        const dataGameMap = await responseGameMap.json()
        if (dataGameMap.map_name) {
          setGameMap(dataGameMap.map_name)
        } else {
          setGameMap([])
        }
        console.log('Load GameMap successful', dataGameMap)
      } else {
        console.error('Load GameMap failed', responseGameMap)
      }
    } catch (error) {
      console.error('Error occurred while Load GameMap in:', error)
    }
  }

  const getScrimOffer = async () => {
    try {
      const responseScrimOffer = await fetch(
        'https://scrim-api-production.up.railway.app/scrim/offer/team-id/' + localStorage.getItem('team_id')
      )
      if (responseScrimOffer.ok) {
        const dataScrimOffer = await responseScrimOffer.json()
        if (dataScrimOffer.scrims == null) {
          setScrimOffer([])
        } else {
          setScrimOffer(dataScrimOffer.scrims)
        }
        console.log('Load ScrimOffer successful', dataScrimOffer)
      } else {
        console.error('Load ScrimOffer failed', responseScrimOffer)
      }
    } catch (error) {
      console.error('Error occurred while Load ScrimOffer in:', error)
    }
  }

  const getScrim = async () => {
    try {
      const responseScrim = await fetch('https://scrim-api-production.up.railway.app/scrim?team_id=' + team_id)
      if (responseScrim.ok) {
        const dataScrim = await responseScrim.json()
        if (dataScrim.scrims == null) {
          setScrim([])
        } else {
          setScrim(dataScrim.scrims)
        }
        console.log('Load Scrim successful', dataScrim)
      } else {
        console.error('Load Scrim failed', responseScrim)
      }
    } catch (error) {
      console.error('Error occurred while Load Scrim in:', error)
    }
  }

  const filteredScrim = scrim.filter((item) => {
    if (selectedMapType === 'some') {
      return selectedMaps.includes(item.scrim_map)
    }
    return true
  })

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

  const handleTeamBattle = async (teamId) => {
    try {
      const responseTeamBattle = await fetch('https://scrim-api-production.up.railway.app/team/detail/team-id/' + teamId)
      if (responseTeamBattle.ok) {
        const dataTeamBattle = await responseTeamBattle.json()
        setTeamBattle(dataTeamBattle)
        setIsOpenTeamBattle(true)
        console.log('Load TeamBattle successful', dataTeamBattle)
      } else {
        console.error('Load TeamBattle failed', responseTeamBattle)
      }
    } catch (error) {
      console.error('Error occurred while Load TeamBattle in:', error)
    }
  }

  const handleTeamBattleMatch = async (teamId, scrimId, mapScrim, date, time) => {
    try {
      if (role == 'Manager' || role == 'Coach') {
        setMatchButton(
          <div className='flex items-center'>
            <Button className='mt-8 mr-2 w-6/12' onClick={() => setIsOpenTeamBattleMatch(false)}>
              Got it!
            </Button>
            <Button color='red' className='mt-8 w-6/12' onClick={() => handleScrimCancel(scrimId)}>
              Cancel Match
            </Button>
          </div>
        )
      }
      const responseTeamBattleMatch = await fetch('https://scrim-api-production.up.railway.app/team/detail/team-id/' + teamId)
      if (responseTeamBattleMatch.ok) {
        let dataTeamBattleMatch = await responseTeamBattleMatch.json()
        dataTeamBattleMatch = { ...dataTeamBattleMatch, scrim_map: mapScrim, scrim_date: date, scrim_time: time }

        setTeamBattle(dataTeamBattleMatch)
        setIsOpenTeamBattleMatch(true)
        console.log('Load TeamBattleMatch successful', dataTeamBattleMatch)
      } else {
        console.error('Load TeamBattleMatch failed', responseTeamBattleMatch)
      }
    } catch (error) {
      console.error('Error occurred while Load TeamBattleMatch in:', error)
    }
  }

  const handleMapChange = (event) => {
    const { value } = event.target
    const index = selectedMaps.indexOf(value)
    if (index === -1) {
      setSelectedMaps([...selectedMaps, value])
    } else {
      const updatedMaps = [...selectedMaps]
      updatedMaps.splice(index, 1)
      setSelectedMaps(updatedMaps)
    }
  }

  const handlePostScrim = async () => {
    try {
      let gameId
      if (game_name == 'Valorant') {
        gameId = 1
      } else if (game_name == 'CSGO2') {
        gameId = 2
      }

      const jsonData = {
        scrim_date: scrimDate.toLocaleDateString(),
        scrim_time: scrimTime,
        scrim_map: scrimMap,
        team_id: parseInt(team_id),
        game_id: parseInt(gameId),
      }
      console.log('Post Scrim', jsonData)

      const responseChangeRole = await fetch('https://scrim-api-production.up.railway.app/scrim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      })

      if (responseChangeRole.ok) {
        getScrim()
        setIsOpenSuccess(true)
        setIsOpenPostScrim(false)
        console.log('PostScrim successful')
      } else {
        setIsOpenError(true)
        console.error('PostScrim failed')
      }
    } catch (error) {
      setIsOpenError(true)
      console.error('Error occurred while PostScrim in:', error)
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
        localStorage.setItem('invite_flag', true)
        setInviteFlag(true)
        setInviteCode(dataInviteCode.invite_code)
        console.log('Update successful', teamName)
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

  const handleScrimAccept = async (scrimId, teamId) => {
    const jsonData = {
      scrim_id: parseInt(scrimId),
      team_id: parseInt(teamId),
    }
    console.log('ScrimAccept', jsonData)
    try {
      const response = await fetch('https://scrim-api-production.up.railway.app/scrim/accept', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      })
      if (response.ok) {
        getScrimOffer()
        setIsOpenSuccess(true)
        console.log('ScrimAccept successful', teamName)
      } else {
        setIsOpenError(true)
        console.error('ScrimAccept failed', response)
      }
    } catch (error) {
      setIsOpenError(true)
      console.error('Error occurred while ScrimAccept in:', error)
    }
  }

  const handleScrimCancel = async (scrimId) => {
    const jsonData = {
      scrim_id: parseInt(scrimId),
      team_id: parseInt(team_id),
    }
    console.log('ScrimCancel', jsonData)
    try {
      const response = await fetch('https://scrim-api-production.up.railway.app/scrim/cancel', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      })
      if (response.ok) {
        getScrim()
        getScrimOffer()
        getMatches()
        setIsOpenSuccess(true)
        console.log('ScrimCancel successful', teamName)
      } else {
        setIsOpenError(true)
        console.error('ScrimCancel failed', response)
      }
    } catch (error) {
      setIsOpenError(true)
      console.error('Error occurred while ScrimCancel in:', error)
    }
  }

  const handleScrimOffer = async (scrimId) => {
    const jsonData = {
      scrim_id: parseInt(scrimId),
      team_id: parseInt(team_id),
    }
    console.log('ScrimOffer', jsonData)
    try {
      const response = await fetch('https://scrim-api-production.up.railway.app/scrim/offer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      })
      if (response.ok) {
        getScrim()
        getScrimOffer()
        setIsOpenSuccess(true)
        console.log('ScrimOffer successful', teamName)
      } else {
        setIsOpenError(true)
        console.error('ScrimOffer failed', response)
      }
    } catch (error) {
      setIsOpenError(true)
      console.error('Error occurred while ScrimOffer in:', error)
    }
  }

  const handleScrimDelete = async (scrimId) => {
    const jsonData = {
      scrim_id: parseInt(scrimId),
    }
    console.log('ScrimDelete', jsonData)
    try {
      const response = await fetch('https://scrim-api-production.up.railway.app/scrim', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      })
      if (response.ok) {
        getScrim()
        getScrimOffer()
        setIsOpenSuccess(true)
        console.log('ScrimDelete successful', teamName)
      } else {
        setIsOpenError(true)
        console.error('ScrimDelete failed', response)
      }
    } catch (error) {
      setIsOpenError(true)
      console.error('Error occurred while ScrimDelete in:', error)
    }
  }

  let memberComponent = member.map((item, index) => {
    let changeRoleDropdown
    if (item.role == 'Manager') {
      changeRoleDropdown = (
        <Select disabled defaultValue={item.role} value={item.role} onValueChange={(e) => handleChangeRole(item.user_id, e)}>
          <SelectItem value='Manager'>Manager</SelectItem>
        </Select>
      )
    } else {
      changeRoleDropdown = (
        <Select defaultValue={item.role} value={item.role} onValueChange={(e) => handleChangeRole(item.user_id, e)}>
          <SelectItem value='Player'>Player</SelectItem>
          <SelectItem value='Coach'>Coach</SelectItem>
        </Select>
      )
    }

    let kickButton
    if (item.role == 'Manager') {
      kickButton = (
        <Button disabled variant='light'>
          <Icon icon={RiCloseCircleLine} onClick={() => handleKick(item.user_id)} variant='simple' tooltip='Kick' color='red' />
        </Button>
      )
    } else {
      kickButton = (
        <Button variant='light'>
          <Icon icon={RiCloseCircleLine} onClick={() => handleKick(item.user_id)} variant='simple' tooltip='Kick' color='red' />
        </Button>
      )
    }

    return (
      <TableRow key={index}>
        <TableCell>{item.nickname}</TableCell>
        <TableCell>{item.role}</TableCell>
        <TableCell>{changeRoleDropdown}</TableCell>
        <TableCell>{kickButton}</TableCell>
      </TableRow>
    )
  })

  let scrimOfferComponent = scrimOffer.map((item, index) => {
    const scrimDate = new Date(item.scrim_date)
    const scrimTime = new Date(item.scrim_time)
    const hours = scrimTime.getUTCHours().toString().padStart(2, '0')
    const minutes = scrimTime.getUTCMinutes().toString().padStart(2, '0')
    const formattedTime = `${hours}:${minutes}`

    return (
      <TableRow key={index}>
        <TableCell>
          <div className='flex items-center'>
            <img
              src={`https://pkeejyrcevjrgrgljqfw.supabase.co/storage/v1/object/public/images/${item.team_logo}`}
              className='h-4 w-4 rounded-full me-2'
            />
            {item.team_name}
          </div>
        </TableCell>
        <TableCell>{item.scrim_map}</TableCell>
        <TableCell>{scrimDate.toLocaleDateString()}</TableCell>
        <TableCell>{formattedTime}</TableCell>
        <TableCell>
          <Button onClick={() => handleScrimAccept(item.scrim_id, item.team_id)}>Accept Offer</Button>
        </TableCell>
        <TableCell>
          <Button variant='light'>
            <Icon icon={RiCloseCircleLine} onClick={() => handleScrimCancel(item.scrim_id)} variant='simple' tooltip='Cancel' color='red' />
          </Button>
        </TableCell>
      </TableRow>
    )
  })

  let scrimComponent = filteredScrim.map((item, index) => {
    const scrimDate = new Date(item.scrim_date)
    const scrimTime = new Date(item.scrim_time)
    const hours = scrimTime.getUTCHours().toString().padStart(2, '0')
    const minutes = scrimTime.getUTCMinutes().toString().padStart(2, '0')
    const formattedTime = `${hours}:${minutes}`

    let buttonScrim
    if (item.flag == 'make offer') {
      buttonScrim = (
        <Button variant='secondary' onClick={() => handleScrimOffer(item.scrim_id)}>
          Make Offer
        </Button>
      )
    } else if (item.flag == 'withdraw offer') {
      buttonScrim = (
        <Button color='red' variant='secondary' onClick={() => handleScrimCancel(item.scrim_id, item.team_id)}>
          Withdraw Offer
        </Button>
      )
    } else if (item.flag == 'delete') {
      buttonScrim = (
        <Button variant='light'>
          <Icon icon={RiDeleteBinLine} onClick={() => handleScrimDelete(item.scrim_id)} variant='simple' tooltip='Delete' color='red' />
        </Button>
      )
    }

    return (
      <TableRow key={index}>
        <TableCell>
          <div className='flex items-center cursor-pointer' onClick={() => handleTeamBattle(item.team_id)}>
            <img
              src={`https://pkeejyrcevjrgrgljqfw.supabase.co/storage/v1/object/public/images/${item.team_logo}`}
              className='h-4 w-4 rounded-full me-2'
            />
            {item.team_name}
          </div>
        </TableCell>
        <TableCell>{item.scrim_map}</TableCell>
        <TableCell>{scrimDate.toLocaleDateString()}</TableCell>
        <TableCell>{formattedTime}</TableCell>
        <TableCell>{buttonScrim}</TableCell>
      </TableRow>
    )
  })

  let gameMapSearchComponent = gameMap.map((item) => {
    return (
      <>
        <input
          className='mr-1'
          type='checkbox'
          id={item}
          name='searchMap'
          value={item}
          checked={selectedMaps.includes(item)}
          onChange={handleMapChange}
        />
        <label className='mr-1' htmlFor={item}>
          {item}
        </label>
      </>
    )
  })

  let matchesComponent = matches.map((item, index) => {
    const matcheDate = new Date(item.scrim_date)
    const matcheTime = new Date(item.scrim_time)
    const hours = matcheTime.getUTCHours().toString().padStart(2, '0')
    const minutes = matcheTime.getUTCMinutes().toString().padStart(2, '0')
    const formattedTime = `${hours}:${minutes}`
    return (
      <TableRow key={index}>
        <TableCell>{matcheDate.toLocaleDateString()}</TableCell>
        <TableCell>
          <div
            className='flex items-center cursor-pointer'
            onClick={() =>
              handleTeamBattleMatch(item.team_id, item.scrim_id, item.scrim_map, matcheDate.toLocaleDateString(), formattedTime)
            }
          >
            <img
              src={`https://pkeejyrcevjrgrgljqfw.supabase.co/storage/v1/object/public/images/${item.team_logo}`}
              className='h-4 w-4 rounded-full me-2'
            />
            {item.team_name}
          </div>
        </TableCell>
        <TableCell>{item.scrim_map}</TableCell>
        <TableCell>{formattedTime}</TableCell>
      </TableRow>
    )
  })

  let teamComponent
  if (team_id == 'null') {
    teamComponent = (
      <>
        <Card className='mx-auto'>
          <h1 className='text-2xl font-bold'>Scrim Search</h1>
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
        </Card>
      </>
    )
  } else {
    if (role == 'Manager') {
      teamComponent = (
        <>
          <Card className='mx-auto'>
            <h1 className='text-2xl font-bold'>Team</h1>
            <TabGroup>
              <TabList className='mt-4'>
                <Tab>Team Settings</Tab>
                <Tab>Members</Tab>
                <Tab>Manage Scrim</Tab>
                <Tab>Search</Tab>
                <Tab>Matches</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <div className='grid grid-flow-col justify-stretch mt-6'>
                    <div className='items-center'>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Team Name</label>
                      <TextInput value={teamName} onChange={(e) => setTeamName(e.target.value)} />
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Team ID</label>
                      <TextInput disabled={true} value={team_id} />
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Game</label>
                      <TextInput className='mb-4' disabled={true} value={game_name} />
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
                  <div>
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
                    <p className='mt-4 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>Role Permissions</p>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeaderCell>⠀</TableHeaderCell>
                          <TableHeaderCell>Manager</TableHeaderCell>
                          <TableHeaderCell>Player</TableHeaderCell>
                          <TableHeaderCell>Coach</TableHeaderCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>Can change role</TableCell>
                          <TableCell>
                            <Icon icon={RiCheckLine} variant='simple' />
                          </TableCell>
                          <TableCell>
                            <Icon icon={RiCloseLine} variant='simple' />
                          </TableCell>
                          <TableCell>
                            <Icon icon={RiCloseLine} variant='simple' />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Can create invite link</TableCell>
                          <TableCell>
                            <Icon icon={RiCheckLine} variant='simple' />
                          </TableCell>
                          <TableCell>
                            <Icon icon={RiCloseLine} variant='simple' />
                          </TableCell>
                          <TableCell>
                            <Icon icon={RiCloseLine} variant='simple' />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Can search a scrim</TableCell>
                          <TableCell>
                            <Icon icon={RiCheckLine} variant='simple' />
                          </TableCell>
                          <TableCell>
                            <Icon icon={RiCloseLine} variant='simple' />
                          </TableCell>
                          <TableCell>
                            <Icon icon={RiCheckLine} variant='simple' />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Can kick person in team</TableCell>
                          <TableCell>
                            <Icon icon={RiCheckLine} variant='simple' />
                          </TableCell>
                          <TableCell>
                            <Icon icon={RiCloseLine} variant='simple' />
                          </TableCell>
                          <TableCell>
                            <Icon icon={RiCloseLine} variant='simple' />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Can check scrim</TableCell>
                          <TableCell>
                            <Icon icon={RiCheckLine} variant='simple' />
                          </TableCell>
                          <TableCell>
                            <Icon icon={RiCheckLine} variant='simple' />
                          </TableCell>
                          <TableCell>
                            <Icon icon={RiCheckLine} variant='simple' />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Can accept or reject offer</TableCell>
                          <TableCell>
                            <Icon icon={RiCheckLine} variant='simple' />
                          </TableCell>
                          <TableCell>
                            <Icon icon={RiCloseLine} variant='simple' />
                          </TableCell>
                          <TableCell>
                            <Icon icon={RiCheckLine} variant='simple' />
                          </TableCell>
                        </TableRow>
                      </TableBody>
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
                          <TableHeaderCell>Team</TableHeaderCell>
                          <TableHeaderCell>Map</TableHeaderCell>
                          <TableHeaderCell>Date</TableHeaderCell>
                          <TableHeaderCell>Time</TableHeaderCell>
                          <TableHeaderCell>Action</TableHeaderCell>
                          <TableHeaderCell>Cancel</TableHeaderCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>{scrimOfferComponent}</TableBody>
                    </Table>
                  </div>
                </TabPanel>
                <TabPanel>
                  <p className='mt-4 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>Search Detail</p>
                  <div className='mb-4'>
                    <label htmlFor='searchMapType' className='block text-sm font-medium text-gray-700 mb-2'>
                      Maps
                    </label>
                    <input
                      className='mr-1'
                      type='radio'
                      id='all'
                      name='searchMapType'
                      value='all'
                      checked={selectedMapType === 'all'}
                      onChange={(e) => setSelectedMapType(e.target.value)}
                    />
                    <label className='mr-1' htmlFor='all'>
                      All Maps
                    </label>
                    <input
                      className='mr-1'
                      type='radio'
                      id='some'
                      name='searchMapType'
                      value='some'
                      checked={selectedMapType === 'some'}
                      onChange={(e) => setSelectedMapType(e.target.value)}
                    />
                    <label className='mr-1' htmlFor='some'>
                      Only Some
                    </label>
                  </div>
                  <div className='mb-4'>{gameMapSearchComponent}</div>
                  <div className='text-center'>
                    <Button icon={RiAddLine} color='purple' onClick={() => setIsOpenPostScrim(true)}>
                      POST YOUR REQUEST
                    </Button>
                  </div>
                  <div className='text-center'>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeaderCell>Team</TableHeaderCell>
                          <TableHeaderCell>Map</TableHeaderCell>
                          <TableHeaderCell>Date</TableHeaderCell>
                          <TableHeaderCell>Time</TableHeaderCell>
                          <TableHeaderCell>Action</TableHeaderCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>{scrimComponent}</TableBody>
                    </Table>
                  </div>
                </TabPanel>
                <TabPanel>
                  <p className='mt-4 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>Matches Detail</p>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeaderCell>Date</TableHeaderCell>
                        <TableHeaderCell>Team</TableHeaderCell>
                        <TableHeaderCell>Map</TableHeaderCell>
                        <TableHeaderCell>Time</TableHeaderCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>{matchesComponent}</TableBody>
                  </Table>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </Card>
        </>
      )
    } else if (role == 'Coach') {
      teamComponent = (
        <>
          <Card className='mx-auto'>
            <h1 className='text-2xl font-bold'>Team</h1>
            <TabGroup>
              <TabList className='mt-4'>
                <Tab>Manage Scrim</Tab>
                <Tab>Search</Tab>
                <Tab>Matches</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <p className='mt-4 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>
                    Manage Scrim Detail
                  </p>
                  <div className=''>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeaderCell>Team</TableHeaderCell>
                          <TableHeaderCell>Map</TableHeaderCell>
                          <TableHeaderCell>Date</TableHeaderCell>
                          <TableHeaderCell>Time</TableHeaderCell>
                          <TableHeaderCell>Action</TableHeaderCell>
                          <TableHeaderCell>Cancel</TableHeaderCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>{scrimOfferComponent}</TableBody>
                    </Table>
                  </div>
                </TabPanel>
                <TabPanel>
                  <p className='mt-4 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>Search Detail</p>
                  <div className='mb-4'>
                    <label htmlFor='searchMapType' className='block text-sm font-medium text-gray-700 mb-2'>
                      Maps
                    </label>
                    <input
                      className='mr-1'
                      type='radio'
                      id='all'
                      name='searchMapType'
                      value='all'
                      checked={selectedMapType === 'all'}
                      onChange={(e) => setSelectedMapType(e.target.value)}
                    />
                    <label className='mr-1' htmlFor='all'>
                      All Maps
                    </label>
                    <input
                      className='mr-1'
                      type='radio'
                      id='some'
                      name='searchMapType'
                      value='some'
                      checked={selectedMapType === 'some'}
                      onChange={(e) => setSelectedMapType(e.target.value)}
                    />
                    <label className='mr-1' htmlFor='some'>
                      Only Some
                    </label>
                  </div>
                  <div className='mb-4'>{gameMapSearchComponent}</div>
                  <div className='text-center'>
                    <Button icon={RiAddLine} color='purple' onClick={() => setIsOpenPostScrim(true)}>
                      POST YOUR REQUEST
                    </Button>
                  </div>
                  <div className='text-center'>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeaderCell>Team</TableHeaderCell>
                          <TableHeaderCell>Map</TableHeaderCell>
                          <TableHeaderCell>Date</TableHeaderCell>
                          <TableHeaderCell>Time</TableHeaderCell>
                          <TableHeaderCell>Action</TableHeaderCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>{scrimComponent}</TableBody>
                    </Table>
                  </div>
                </TabPanel>
                <TabPanel>
                  <p className='mt-4 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>Matches Detail</p>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeaderCell>Date</TableHeaderCell>
                        <TableHeaderCell>Team</TableHeaderCell>
                        <TableHeaderCell>Map</TableHeaderCell>
                        <TableHeaderCell>Time</TableHeaderCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>{matchesComponent}</TableBody>
                  </Table>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </Card>
        </>
      )
    } else {
      teamComponent = (
        <>
          <Card className='mx-auto'>
            <h1 className='text-2xl font-bold'>Team</h1>
            <TabGroup>
              <TabList className='mt-4'>
                <Tab>Matches</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <p className='mt-4 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>Matches Detail</p>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeaderCell>Date</TableHeaderCell>
                        <TableHeaderCell>Team</TableHeaderCell>
                        <TableHeaderCell>Map</TableHeaderCell>
                        <TableHeaderCell>Time</TableHeaderCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>{matchesComponent}</TableBody>
                  </Table>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </Card>
        </>
      )
    }
  }

  const time = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
  ]

  let gameTimeComponent = time.map((item) => {
    return (
      <>
        <input className='mr-1' type='radio' id={item} name='time' value={item} onChange={(e) => setScrimTime(e.target.value)} />
        <label className='mr-6' htmlFor={item}>
          {item}
        </label>
      </>
    )
  })

  let gameMapComponent = gameMap.map((item) => {
    return (
      <>
        <input className='mr-1' type='radio' id={item} name='game' value={item} onChange={(e) => setScrimMap(e.target.value)} />
        <label className='mr-1' htmlFor={item}>
          {item}
        </label>
      </>
    )
  })

  let memberBattleComponent
  if (!teamBattle.members) {
    memberBattleComponent = (
      <>
        <p>No member in this team.</p>
      </>
    )
  } else {
    memberBattleComponent = teamBattle.members.map((item) => {
      let rolememberBattle = <p>{item.nickname}</p>
      if (item.role == 'Manager') {
        rolememberBattle = (
          <p>
            {item.nickname} (Manager) Phone Number : {item.phone_number}
          </p>
        )
      } else if (item.role == 'Coach') {
        rolememberBattle = <p>{item.nickname} (Coach)</p>
      }
      return (
        <>
          <div className='flex items-center'>
            <img
              src='https://png.pngtree.com/png-vector/20191003/ourlarge/pngtree-cyber-man-icon-isolated-on-abstract-background-png-image_1779333.jpg'
              className='h-4 w-4 rounded-full me-2'
            />
            {rolememberBattle}
          </div>
        </>
      )
    })
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
    localStorage.removeItem('invite_code')
    localStorage.removeItem('invite_flag')
    localStorage.removeItem('team_logo')
    console.log('Logout successful')
    navigate('/')
  }
  return (
    <div className='flex h-screen bg-gray-100'>
      <Dialog open={isOpenTeamBattleMatch} onClose={(val) => setIsOpenTeamBattleMatch(val)} static={true}>
        <DialogPanel>
          <div className='flex items-center'>
            <img
              src={`https://pkeejyrcevjrgrgljqfw.supabase.co/storage/v1/object/public/images/${teamBattle.team_logo}`}
              className='h-20 w-20 rounded-full me-2'
            />
            <h3 className='text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong'>
              {teamBattle.team_name}
            </h3>
          </div>

          <p className='mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>
            <div className='mb-4'>Members</div>
            {memberBattleComponent}
          </p>

          <p className='mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>
            <div className='mb-4'>Map : {teamBattle.scrim_map}</div>
          </p>
          <p className='mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>
            <div className='mb-4'>Date : {teamBattle.scrim_date}</div>
          </p>
          <p className='mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>
            <div className='mb-4'>Time : {teamBattle.scrim_time}</div>
          </p>
          {matchButton}
        </DialogPanel>
      </Dialog>
      <Dialog open={isOpenTeamBattle} onClose={(val) => setIsOpenTeamBattle(val)} static={true}>
        <DialogPanel>
          <div className='flex items-center'>
            <img
              src={`https://pkeejyrcevjrgrgljqfw.supabase.co/storage/v1/object/public/images/${teamBattle.team_logo}`}
              className='h-20 w-20 rounded-full me-2'
            />
            <h3 className='text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong'>
              {teamBattle.team_name}
            </h3>
          </div>

          <p className='mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>
            <div className='mb-4'>Members</div>
            {memberBattleComponent}
          </p>
          <Button className='mt-8 w-full' onClick={() => setIsOpenTeamBattle(false)}>
            Got it!
          </Button>
        </DialogPanel>
      </Dialog>
      <Dialog open={isOpenPostScrim} onClose={(val) => setIsOpenPostScrim(val)} static={true}>
        <DialogPanel>
          <h3 className='text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong'>POST YOUR REQUEST</h3>
          <p className='mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>
            <div className='mb-4'>
              <label htmlFor='scrimDate' className='block text-sm font-medium text-gray-700 mb-2'>
                Date
              </label>
              <DatePicker minDate={new Date()} className='mx-auto max-w-sm' value={scrimDate} onValueChange={(e) => setScrimDate(e)} />
            </div>
            <div className='mb-4'>
              <label htmlFor='scrimTime' className='block text-sm font-medium text-gray-700 mb-2'>
                Time
              </label>
              {gameTimeComponent}
            </div>
            <div className='mb-4'>
              <label htmlFor='scrimMap' className='block text-sm font-medium text-gray-700 mb-2'>
                Map
              </label>
              {gameMapComponent}
            </div>
          </p>
          <Button className='mt-8 w-full' onClick={() => handlePostScrim()}>
            Save your request
          </Button>
        </DialogPanel>
      </Dialog>
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
          {teamComponent}
          <Divider>
            <Icon icon={RiShiningFill} variant='simple' tooltip='WeScrim' size='xs' color='gray-400' />
          </Divider>
        </div>
      </div>
    </div>
  )
}

export default Header
