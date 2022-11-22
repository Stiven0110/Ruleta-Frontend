import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Roulette } from '../components';
import iconBack from '../assets/img/iconBack.png';
import { AuthContext } from '../context/fakeAuthContext';

export const Draw = () => {
  const { signout } = useContext(AuthContext);
  const location = useLocation()
  const [isAvailable, setIsAvailable] = useState(true);

  const navigate = useNavigate()
  const goBack = () => {
    setIsAvailable(true)
    signout()
    navigate('/')
  }
  return (
    <section className="fondo">
      <Roulette gifts={location.state.gifts} code={location.state.code} isAvailable={isAvailable} setIsAvailable={setIsAvailable} />
      <button className='iconBack' onClick={goBack} > <img src={iconBack} alt="" width={70} /></button>
    </section>
  )

}
