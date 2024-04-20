import Header from '../components/Header'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
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
        localStorage.setItem('team_logo', dataTeam.team_logo)
        localStorage.setItem('invite_flag', dataTeam.invite_flag)
        localStorage.setItem('invite_code', dataTeam.invite_code)
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
      <Header
        nickname={localStorage.getItem('nickname')}
        team_id={localStorage.getItem('team_id')}
        team_name={localStorage.getItem('team_name')}
        role={localStorage.getItem('role')}
        game_id={localStorage.getItem('game_id')}
        game_name={localStorage.getItem('game_name')}
        invite_code={localStorage.getItem('invite_code')}
        invite_flag={localStorage.getItem('invite_flag')}
        team_logo={localStorage.getItem('team_logo')}
      />
    </div>
  )
}

export default Home
