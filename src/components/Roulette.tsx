import React, { useState,useEffect } from 'react'
import { Wheel } from 'react-custom-roulette'


export const Roulette =( props:any) => {

  
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [data,setData] = useState([])
  
  const handleSpinClick = () => {
    setPrizeNumber(5)
    setMustSpin(true)
  }

  useEffect(()=>{
    setData(props.gifts)
  },[])

  return (
    <>
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        spinDuration={0.5}
        outerBorderColor={"#ccc"}
        outerBorderWidth={9}
        innerBorderColor={"#f2f2f2"}
        radiusLineColor={"tranparent"}
        radiusLineWidth={1}
        textColors={["#f5f5f5"]}
        backgroundColors={[
          "#ff0000",
          "#ff7800",
        ]}
        textDistance={55}
        fontSize={25}
        data={data}
        onStopSpinning={() => {
          setMustSpin(false);
        }}
      />
      <button onClick={handleSpinClick}>SPIN</button>
    
      
    </>
  )
}