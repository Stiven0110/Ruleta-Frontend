import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Wheel } from 'react-custom-roulette'
import { ICode } from '../types/ICode'
import { ModalRendering } from './Modal';

const updateStatus = async (id: number, status: boolean): Promise<ICode | number> => {
  const data = axios.patch(`${import.meta.env.VITE_APP_URL}/api/v1/codes/${id}`, { newStatus: status })
    .then((response) => response.data)
    .catch((error) => error.response.status)
  console.log(data, "data updte")
  return data
}

export const Roulette = (props: any) => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [data, setData] = useState([])
  const [contentModal, setcontentModal] = useState(``);
  const [titleModal, setTitleModal] = useState(`GANASTE!!!`);
  const [showModal, setShowModal] = useState(false);
  const handleSpinClick = () => {
    setPrizeNumber(props.code.id_premio_fk - 1)
    setMustSpin(true)
  }
  useEffect(() => {
    setData(props.numGifts)
  }, [])
  return (
    <>
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        spinDuration={0.7}
        outerBorderColor={"#ccc"}
        outerBorderWidth={9}
        innerBorderColor={"#f2f2f2"}
        radiusLineColor={"tranparent"}
        radiusLineWidth={1}
        textColors={["#f5f5f5"]}
        backgroundColors={[
          "#e30700",
          "#ffc907",
          "#ff7800"
        ]}
        textDistance={69}
        fontSize={28}
        data={data}
        onStopSpinning={() => {
          setMustSpin(false);
          setShowModal(true);
          setcontentModal(`Felicidades ganaste  ${props.gifts[props.code.id_premio_fk - 1].option} ${props.code.numero_chance && `con el número: ${props.code.numero_chance}`}`);
          updateStatus(props.code.id_codigo_pk, true);
          console.log("se detuvo");

        }}
      />
      <button className='girarRuleta' onClick={handleSpinClick}>SPIN</button>
      <ModalRendering title={titleModal} res={contentModal} showModal={showModal} setShowModal={setShowModal} />


    </>
  )
}