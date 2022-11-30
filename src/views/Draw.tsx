import { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Roulette } from '../components';
import iconBack from '../assets/img/iconBack.png';
import { AuthContext } from '../context/fakeAuthContext';

export const Draw = () => {
  const [gifts, setGifts]: any[] = useState([])
  const [numGifts, setnumGifts]: any[] = useState([])

  const { signout } = useContext(AuthContext);
  const location = useLocation()
  const [mountRoulette, setmountRoulette] = useState(true);

  const navigate = useNavigate()
  const goBack = () => {
    signout()
    navigate('/')
  }

  useEffect(() => {
    location.state.gifts.forEach((gift: any) => {
      gifts.push({ option: gift.premio })
      numGifts.push({ option: gift.id_premio_pk })
    })
  }
    , [])

  return (
    <section className="fondo">
      {mountRoulette && <Roulette gifts={gifts} numGifts={numGifts} code={location.state.code} />}
      <button className='iconBack' onClick={goBack} > <img src={iconBack} alt="" width={70} /></button>
    </section>
  )

}
