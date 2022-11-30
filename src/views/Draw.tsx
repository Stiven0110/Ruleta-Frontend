import { useContext, useState,useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Roulette } from '../components';
import iconBack from '../assets/img/iconBack.png';
import { AuthContext } from '../context/fakeAuthContext';

export const Draw = () => {
  const [gifts,setGifts] :any[] = useState([])
  const { signout } = useContext(AuthContext);
  const location = useLocation()

  const navigate = useNavigate()
  const goBack = () => {
    // setIsAvailable(true)
    signout()
    navigate('/')
  }

  useEffect(()=>{
    location.state.gifts.forEach((gift:any)=>{
      gifts.push({option:gift.id_premio_pk})
    })
  },[])

  return (
    <section className="fondo">
      <Roulette gifts={gifts} code={location.state.code} />
      <button className='iconBack' onClick={goBack} > <img src={iconBack} alt="" width={70} /></button>
    </section>
  )

}
