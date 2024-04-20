import HeaderSettings from '../components/HeaderSettings'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Settings() {
  const navigate = useNavigate()

  useEffect(() => {
    const nicknameLocal = localStorage.getItem('nickname')
    if (!nicknameLocal) {
      navigate('/')
    } else {
      getTeam()
    }
  }, [navigate])

  const getTeam = async () => {
    try {
      const responseTeam = await fetch('https://scrim-api-production.up.railway.app/team/detail/team-id/' + localStorage.getItem('team_id'))
      if (responseTeam.ok) {
        const dataTeam = await responseTeam.json()
        localStorage.setItem('team_name', dataTeam.team_name)
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
      <HeaderSettings
        user_id={localStorage.getItem('user_name')}
        nickname={localStorage.getItem('nickname')}
        email={localStorage.getItem('email')}
        phoneNumber={localStorage.getItem('phone_number')}
        game_id={localStorage.getItem('game_id')}
      />
    </div>
  )
}

export default Settings
