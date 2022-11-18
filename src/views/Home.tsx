import axios from 'axios';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

import { ICode } from '../types/ICode';
import { IGift } from '../types/IGift';
import { ModalRendering } from '../components/Modal'
import { AuthContext } from '../context/fakeAuthContext';

const validateCode = async (code: string): Promise<ICode | number> => {
  const data = axios.post(`${import.meta.env.VITE_APP_URL}/api/v1/codes`, { code: code })
    .then((response) => response.data)
    .catch((error) => error.response.status)
  return data
}
const getGifts = async (): Promise<IGift[]> => {
  const gifts = axios.get(`${import.meta.env.VITE_APP_URL}/api/v1/gifts`)
    .then((response) => response.data)
    .catch((error) => error)
  return gifts;
}
export const Home = () => {
  const { signin } = useContext(AuthContext);
  const [contentModal, setcontentModal] = useState(``);
  const [titleModal, settitleModal] = useState(`ERROR!!!`);
  const [showModal, setShowModal] = useState(false);
  const [value, setValue] = useState("");
  const navigate = useNavigate()
  const handleInputValue = (ev: any) => {
    setValue(ev.target.value)
  }
  const showFunction = async (ev: any) => {
    const res = await validateCode(value)
    if (typeof res === 'number') {
      setShowModal(true)
      if (res === 404) {
        setcontentModal(`Error : Código no existe`)
      }
      if (res === 423) {
        setcontentModal(`Error : Código ya jugado`)
      }
      if (res === 500) {
        setcontentModal(`Error : Intente más tarde`)
      }

    } else {
      const dataGifts = await getGifts()
      signin()
      navigate('/Awards', {
        state: {
          gifts: dataGifts,
          code: res
        }
      })

    }
  }
  return (
    <div className="contenedor">
      <Card>
        <Card.Text>
          <h2>Ingrese Codigo</h2>
        </Card.Text>
        <input
          type="text"
          value={value}
          onChange={handleInputValue}
        >
        </input>
        <button
          onClick={showFunction}
        >
          Entra!
        </button>
        <ModalRendering title={titleModal} res={contentModal} showModal={showModal} setShowModal={setShowModal} />
      </Card>
    </div >
  )
}