import Header from '../components/Header'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')

  useEffect(() => {
    const nicknameLocal = localStorage.getItem('nickname')
    if (!nicknameLocal) {
      navigate('/')
    } else {
      setNickname(nicknameLocal)
    }
  }, [navigate])
  return (
    <div>
      <Header
        nickname={nickname}
        team_id={localStorage.getItem('team_id')}
        team_name={localStorage.getItem('team_name')}
        role={localStorage.getItem('role')}
        game_name={localStorage.getItem('game_name')}
      />
      <p> Blue</p>
    </div>
  )
}

export default Home
