import axios from 'axios';
import { useContext, useEffect, useRef, useState } from 'react';

import { ICode } from '../types/ICode';
import { IGift } from '../types/IGift';
import { ModalRendering } from '../components/Modal'

type props = {
  gifts: IGift[],
  code: ICode,
  // isAvailable: boolean,
  // setIsAvailable: any
}
const updateStatus = async (id: number, status: boolean): Promise<ICode | number> => {
  const data = axios.patch(`${import.meta.env.VITE_APP_URL}/api/v1/codes/${id}`, { newStatus: status })
    .then((response) => response.data)
    .catch((error) => error.response.status)
  return data
}
export const Roulette = (props: props) => {
  const PI = Math.PI;
  const TAU = 2 * PI;
  const angVelMin = 0.002; // Below that number will be treated as a stop
  let angVel = 0;    // Current angular velocity
  let ang = 0;       // Angle rotation in radians
  let isSpinning = false;
  let isAccelerating = false;
  let sound = new Audio('src/assets/sound/ruleta.wav')
  let win = new Audio('src/assets/sound/Win.wav')


  const { gifts: sectors, code } = props;
  const [angVelMax, setAngVelMax] = useState(0); // Random ang.vel. to acceletare to
  const [isAvailable, setIsAvailable] = useState(true);
  const speeds = [
    { id: 1, speedsList: [0.62, 1.023798] },
    { id: 2, speedsList: [0.84] },
    { id: 3, speedsList: [2.3] },
    { id: 4, speedsList: [2.6, 0.33] },
    { id: 5, speedsList: [0.65, 0.641925] },
    { id: 6, speedsList: [0.98, 1.3, 0.4567632468] },
    { id: 7, speedsList: [1.2, 0.36, 2.5] },
    { id: 8, speedsList: [0.69, 0.4056789, 0.6874] },
    { id: 9, speedsList: [0.54, 0.91] },
    { id: 10, speedsList: [0.89] },
    { id: 11, speedsList: [0.73, 0.89] },
    { id: 12, speedsList: [0.77, 1.4, 0.819] },
    { id: 13, speedsList: [1.8856] },
    { id: 14, speedsList: [0.50, 1.1] },
    { id: 15, speedsList: [0.57, 0.345] },
    { id: 16, speedsList: [2.8, 1.46798] },
    { id: 17, speedsList: [0.39, 1.8, 1.23798] },
    { id: 18, speedsList: [0.30, 0.2445654] },
    { id: 19, speedsList: [1.6] },
  ]
  const arc = TAU / sectors.length;
  const numberOfSectors = sectors.length;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const spinRef = useRef<HTMLDivElement | null>(null);
  const [diameter, setDiameter] = useState(0);

  const [friction, setFriction] = useState(0.991);
  const [contentModal, setcontentModal] = useState(``);
  const [titleModal, setTitleModal] = useState(`GANASTE!!!`);
  const [showModal, setShowModal] = useState(false);
  let radius = diameter / 2;
  const getIndex = () => Math.floor(numberOfSectors - ang / TAU * numberOfSectors) % numberOfSectors;
  const drawSector = (sector: any, index: number, ctx: CanvasRenderingContext2D) => {
    const ang = arc * index;
    ctx.save();
    // COLOR
    ctx.beginPath();
    ctx.fillStyle = sector.color;
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, ang, ang + arc);
    ctx.lineTo(radius, radius);
    ctx.fill();
    // TEXT
    ctx.translate(radius, radius);
    ctx.rotate(ang + arc / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(sector.label, radius - 10, 10);
    ctx.restore();
  }
  const runGame = () => {
    if (isAvailable) {
      sound.play()
    }
    if (!isAvailable) return;
    setIsAvailable(false)
    if (isSpinning) return;
    isSpinning = true;
    isAccelerating = true;
  }
  const randomSpeed = () => {
    const speedsListValue = speeds.find((speed) => speed.id == code.id_premio_fk)
    if (speedsListValue) {
      return speedsListValue.speedsList[Math.floor(Math.random() * speedsListValue.speedsList.length)]
    }
    return 0.0
  }
  useEffect(() => {
    setAngVelMax(randomSpeed())
    if (code.id_premio_fk === 10) {
      setFriction(0.99105);
    }
    if (code.id_premio_fk === 2) {
      setFriction(0.994);
    }
    win.pause();
  }, [runGame])
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const canvasContext = canvas.getContext('2d');
      canvasContext?.restore()
      if (canvasContext) {
        canvasCtxRef.current = canvasContext;
        setDiameter(canvasContext.canvas.width)
        if (radius != 0) {
          sectors.forEach((sector: IGift, index: number) => drawSector(sector, index, canvasContext));
          const spin = spinRef.current;
          if (spin) {
            const rotate = () => {
              const sector = sectors[getIndex()];

              canvasContext.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
              spin.textContent = !angVel ? "Jugar!!!" : sector.label;
              spin.style.background = sector.color;
            }
            const frame = () => {
              if (!isSpinning) return;
              if (angVel >= angVelMax) isAccelerating = false;
              // Accelerate
              if (isAccelerating) {
                angVel ||= angVelMin; // Initial velocity kick
                angVel *= 1.06; // Accelerate              
              }
              // Decelerate
              else {
                isAccelerating = false;
                angVel *= friction; // Decelerate by friction
                // SPIN END:
                if (angVel < angVelMin) {
                  isSpinning = false;
                  angVel = 0;
                  setShowModal(true)
                  const gift = sectors.find((sector: any) => sector.id_premio_pk === code.id_premio_fk)?.premio
                  setcontentModal(`Felicidades ganaste  ${gift} ${code.numero_chance && `con el número: ${code.numero_chance}`}`)
                  updateStatus(code.id_codigo_pk, true)
                  win.play()
                  sound.pause()
                }
              }
              ang += angVel; // Update angle
              ang %= TAU;    // Normalize angle
              rotate();      // CSS rotate!
            };
            const engine = () => {
              frame();
              requestAnimationFrame(engine)
            };
            rotate();
            engine();
          }
        }
      }
    }
  }, [diameter])
  return (
    <div id="wheelOfFortune">
      <canvas ref={canvasRef} id="wheel" width="400px" height="400px"></canvas>
      <div ref={spinRef} id="spin" onClick={runGame}>Jugar!!!</div>
      <ModalRendering title={titleModal} res={contentModal} showModal={showModal} setShowModal={setShowModal} />

    </div>
  )
}
