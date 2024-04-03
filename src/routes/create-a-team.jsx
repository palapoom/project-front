import HeaderCreateATeam from '../components/HeaderCreateATeam'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function CreateATeam() {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [inviteFlag, setInviteFlag] = useState(false)
  const [inviteCode, setInviteCode] = useState('')

  useEffect(() => {
    const nicknameLocal = localStorage.getItem('nickname')
    if (!nicknameLocal) {
      navigate('/')
    } else {
      setNickname(nicknameLocal)
      getTeam()
    }
  }, [navigate])

  const getTeam = async () => {
    try {
      const responseTeam = await fetch('https://scrim-api-production.up.railway.app/team/detail/team-id/' + localStorage.getItem('team_id'))
      if (responseTeam.ok) {
        const dataTeam = await responseTeam.json()
        localStorage.setItem('team_name', dataTeam.team_name)
        setInviteFlag(dataTeam.invite_flag)
        setInviteCode(dataTeam.invite_code)
        console.log('Load Team successful', dataTeam)
      } else {
        console.error('Load Team failed', responseTeam)
      }
    } catch (error) {
      console.error('Error occurred while Load Team in:', error)
    }
  }

  return (
    <div>
      <HeaderCreateATeam
        user_id={localStorage.getItem('user_name')}
        nickname={nickname}
        team_id={localStorage.getItem('team_id')}
        team_name={localStorage.getItem('team_name')}
        role={localStorage.getItem('role')}
        game_name={localStorage.getItem('game_name')}
        invite_code={inviteCode}
        invite_flag={inviteFlag}
      />
    </div>
  )
}

export default CreateATeam
