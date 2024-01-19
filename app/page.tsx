"use client"

import styles from './page.module.css'
import { useEffect, useState } from 'react'

import { IconContext } from "react-icons";

import { FaBitcoin } from "react-icons/fa";
import { FaEthereum } from "react-icons/fa";
import { SiTether } from "react-icons/si";

export default function Home() {

  const [btc, setBtc] = useState<number>(0)
  const [eth, setEth] = useState<number>(0)

  const usdtbtc = 0.00002426
  const usdteth = 0.00040572

  const [leftSide, setLeftSide] = useState<string>("BTC")
  const [rightSide, setRightSide] = useState<string>("ETH")

  const [numberLeft, setNumberLeft] = useState<number | string >("")
  const [numberRight, setNumberRight] = useState<number | string >("")

  const [sideFocus, setSideFocus] = useState<string>("")

  useEffect(() => {
    fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
    .then(res => res.json())
    .then(res => setBtc(res.price))
  },[])

  useEffect(() => {
    fetch('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT')
    .then(res => res.json())
    .then(res => setEth(res.price))
  },[])

  if (btc) {
    console.log(btc)
  }
  if (eth) {
    console.log(eth)
  }

  const calculate = (value: number, side: string, leftCoin: string, rightCoin: string) => {

    let leftSide = leftCoin
    let rightSide = rightCoin

    if (side === 'left') {
      (leftSide === 'BTC' && rightSide === 'BTC') ? setNumberRight(value)
      : (leftSide === 'BTC' && rightSide === 'ETH') ? setNumberRight(Math.round(((value * btc / eth) + Number.EPSILON) * 100000000) / 100000000)
      : (leftSide === 'BTC' && rightSide === 'USDT') ? setNumberRight(Math.round(((value * btc) + Number.EPSILON) * 100000000) / 100000000)
  
      : (leftSide === 'ETH' && rightSide === 'ETH') ? setNumberRight(value) 
      : (leftSide === 'ETH' && rightSide === 'BTC') ? setNumberRight(Math.round(((value * eth / btc) + Number.EPSILON) * 100000000) / 100000000)
      : (leftSide === 'ETH' && rightSide === 'USDT') ? setNumberRight(Math.round(((value * eth) + Number.EPSILON) * 100000000) / 100000000)
  
      : (leftSide === 'USDT' && rightSide === 'USDT') ? setNumberRight(value)
      : (leftSide === 'USDT' && rightSide === 'BTC') ? setNumberRight(Math.round(((value * usdtbtc) + Number.EPSILON) * 100000000) / 100000000)
      : (leftSide === 'USDT' && rightSide === 'ETH') ? setNumberRight(Math.round(((value * usdteth) + Number.EPSILON) * 100000000) / 100000000)
  
    : null
    }

    else if (side === 'right') {
      (leftSide === 'BTC' && rightSide === 'BTC') ? setNumberLeft(value) 
      : (leftSide === 'BTC' && rightSide === 'ETH') ? setNumberLeft(Math.round(((value * eth / btc) + Number.EPSILON) * 100000000) / 100000000)
      : (leftSide === 'BTC' && rightSide === 'USDT') ? setNumberLeft(Math.round(((value * usdtbtc) + Number.EPSILON) * 100000000) / 100000000)
  
      : (leftSide === 'ETH' && rightSide === 'ETH') ? setNumberLeft(value) 
      : (leftSide === 'ETH' && rightSide === 'BTC') ? setNumberLeft(Math.round(((value * btc / eth) + Number.EPSILON) * 100000000) / 100000000)
      : (leftSide === 'ETH' && rightSide === 'USDT') ? setNumberLeft(value * usdteth)
  
      : (leftSide === 'USDT' && rightSide === 'USDT') ? setNumberLeft(value)
      : (leftSide === 'USDT' && rightSide === 'BTC') ? setNumberLeft(Math.round(((value * btc) + Number.EPSILON) * 100000000) / 100000000)
      : (leftSide === 'USDT' && rightSide === 'ETH') ? setNumberLeft(Math.round(((value * eth) + Number.EPSILON) * 100000000) / 100000000)
  
    : null
    }
  }

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {

    if (e.currentTarget.name === 'left') {
      setNumberLeft(Number(e.currentTarget.value))
      setSideFocus('left')

      if (e.currentTarget.value === "00" || e.currentTarget.value.match(/0\d/i)) setNumberLeft("")
      else {
        if (btc && eth) calculate(Number(e.currentTarget.value), e.currentTarget.name, leftSide, rightSide)
      }
    }
    else if (e.currentTarget.name === 'right') {
      setNumberRight(Number(e.currentTarget.value))
      setSideFocus('right')

      if (e.currentTarget.value === "00" || e.currentTarget.value.match(/0\d/i)) setNumberRight("")
      else {
        if (btc && eth) calculate(Number(e.currentTarget.value), e.currentTarget.name, leftSide, rightSide)
      }
    }
  }

  const handleLeftSide = (e: React.FormEvent<HTMLSelectElement>) => {
    setLeftSide(e.currentTarget.value)
    setSideFocus('left')
    if (btc && eth) calculate(Number(numberLeft), "left", e.currentTarget.value, rightSide)
  }

  const handleRightSide = (e: React.FormEvent<HTMLSelectElement>) => {
    setRightSide(e.currentTarget.value)
    setSideFocus('right')
    if (btc && eth) calculate(Number(numberRight), "right", leftSide, e.currentTarget.value)
  }


  function BtcIcon() {
    return (
      <IconContext.Provider
        value={{ color: '#f7931a', size: '26px' }}
      >
        <div>
          <FaBitcoin className='icon'/>
        </div>
      </IconContext.Provider>
    );
  }
  function EthIcon() {
    return (
      <IconContext.Provider
        value={{ color: '#716b94', size: '26px' }}
      >
        <div>
          <FaEthereum className='icon'/>
        </div>
      </IconContext.Provider>
    );
  }
  function UsdtIcon() {
    return (
      <IconContext.Provider
        value={{ color: '#26A17B', size: '26px' }}
      >
        <div>
          <SiTether className='icon'/>
        </div>
      </IconContext.Provider>
    );
  }

  const inputLeft = document.querySelector('.inputLeft') as HTMLInputElement | null;
  const inputRight = document.querySelector('.inputRight') as HTMLInputElement | null;

  let inputLeftColor = "blue"
  let inputRightColor = "blue"

  {(leftSide === 'BTC') ? inputLeftColor = "#f7931a" : (leftSide === 'ETH') ? inputLeftColor = "#716b94" : (leftSide === 'USDT') ? inputLeftColor = "#26A17B" : ""}
  {(rightSide === 'BTC') ? inputRightColor = "#f7931a" : (rightSide === 'ETH') ? inputRightColor = "#716b94" : (rightSide === 'USDT') ? inputRightColor = "#26A17B" : ""}

  inputLeft?.addEventListener('focus', () => {
    inputLeft.style.outline = `2px solid ${inputLeftColor}`;
  })
  inputLeft?.addEventListener('blur', () => {
    inputLeft.style.outline = 'none';
  })

  inputRight?.addEventListener('focus', () => {
    inputRight.style.outline = `2px solid ${inputRightColor}`;
  })
  inputRight?.addEventListener('blur', () => {
    inputRight.style.outline = 'none';
  })


  return (
    <main className='main'>

      <div className='wrapper'>
        <input onChange={handleChange} value={numberLeft} name="left" type="number" min={0} max={1000000000} className='input inputLeft'></input>
    
        <select onChange={handleLeftSide} defaultValue="BTC" className='select'>
          <option className="btcLeft" value="BTC" defaultChecked>BTC</option>
          <option value="ETH">ETH</option>
          <option value="USDT">USDT</option>
        </select>

        {(leftSide === 'BTC') ? <BtcIcon /> : (leftSide === 'ETH') ? <EthIcon /> : (leftSide === 'USDT') ? <UsdtIcon /> : null}

      </div>

      
      <div className='wrapper'>
        <input onChange={handleChange} value={numberRight} name="right" type="number" min={0} max={1000000000} className='input inputRight'></input>

        <select onChange={handleRightSide} defaultValue="ETH" className='select'>
          <option value="BTC">BTC</option>
          <option value="ETH" defaultChecked>ETH</option>
          <option value="USDT">USDT</option>
        </select>

        {(rightSide === 'BTC') ? <BtcIcon /> : (rightSide === 'ETH') ? <EthIcon /> : (rightSide === 'USDT') ? <UsdtIcon /> : null}

      </div>

    </main>
  )
}