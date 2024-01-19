"use client"

import styles from './page.module.css'
import { useEffect, useState } from 'react'

export default function Home() {

  const [btc, setBtc] = useState<number>(0)
  const [eth, setEth] = useState<number>(0)

  const usdtbtc = 0.00002426
  const usdteth = 0.00040572


  const [leftSide, setLeftSide] = useState<string>("BTC")
  const [rightSide, setRightSide] = useState<string>("ETH")

  const [numberLeft, setNumberLeft] = useState<number | string >("")
  const [numberRight, setNumberRight] = useState<number | string >("")

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

      if (e.currentTarget.value === "00" || e.currentTarget.value.match(/0\d/i)) setNumberLeft("")
      else {
        if (btc && eth) calculate(Number(e.currentTarget.value), e.currentTarget.name, leftSide, rightSide)
      }
    }
    else if (e.currentTarget.name === 'right') {
      setNumberRight(Number(e.currentTarget.value))

      if (e.currentTarget.value === "00" || e.currentTarget.value.match(/0\d/i)) setNumberRight("")
      else {
        if (btc && eth) calculate(Number(e.currentTarget.value), e.currentTarget.name, leftSide, rightSide)
      }
    }
  }

  const handleLeftSide = (e: React.FormEvent<HTMLSelectElement>) => {
    setLeftSide(e.currentTarget.value)
    if (btc && eth) calculate(Number(numberLeft), "left", e.currentTarget.value, rightSide)
  }

  const handleRightSide = (e: React.FormEvent<HTMLSelectElement>) => {
    setRightSide(e.currentTarget.value)
    if (btc && eth) calculate(Number(numberRight), "right", leftSide, e.currentTarget.value)
  }

  return (
    <main className='main'>

      <div>
        <input onChange={handleChange} value={numberLeft} name="left" type="number" min={0} max={1000000000}></input>

        <select onChange={handleLeftSide} defaultValue="BTC">
          <option value="BTC" defaultChecked>BTC</option>
          <option value="ETH">ETH</option>
          <option value="USDT">USDT</option>
        </select>
      </div>


      <div>
        <input onChange={handleChange} value={numberRight} name="right" type="number" min={0} max={1000000000}></input>

        <select onChange={handleRightSide} defaultValue="ETH">
          <option value="BTC">BTC</option>
          <option value="ETH" defaultChecked>ETH</option>
          <option value="USDT">USDT</option>
        </select>
      </div>
      
    </main>
  )
}