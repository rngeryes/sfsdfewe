'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

const key1 = '/images/key1.png'
const key2 = '/images/key2.png'
const key3 = '/images/key3.png'
const nothing = '/images/nothing.png'

const WHEEL_COOLDOWN_MS = 12 * 60 * 60 * 1000 // 12 часов
const LOCAL_STORAGE_KEY = 'wheel_last_spin'

const WheelTab = () => {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [prize, setPrize] = useState('')
  const [cooldown, setCooldown] = useState(0)

  const prizes = [
    { name: 'Деревянный ключ', image: key1 },
    { name: 'Серебрянный ключ', image: key2 },
    { name: 'Золотой ключ', image: key3 },
    { name: 'Ничего', image: nothing }
  ]

  const sectionCount = prizes.length
  const sectionAngle = 360 / sectionCount

  // ===================== Инициализация cooldown при монтировании =====================
  useEffect(() => {
    const lastSpin = parseInt(localStorage.getItem(LOCAL_STORAGE_KEY) || '0', 10)
    const now = Date.now()
    const remaining = lastSpin + WHEEL_COOLDOWN_MS - now
    setCooldown(remaining > 0 ? remaining : 0)
  }, [])

  // ===================== Таймер cooldown =====================
  useEffect(() => {
    const interval = setInterval(() => {
      const lastSpin = parseInt(localStorage.getItem(LOCAL_STORAGE_KEY) || '0', 10)
      const now = Date.now()
      const remaining = lastSpin + WHEEL_COOLDOWN_MS - now
      setCooldown(remaining > 0 ? remaining : 0)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`
  }

  // ===================== Кнопка спина =====================
  const spinWheel = () => {
    if (isSpinning || cooldown > 0) return

    setIsSpinning(true)
    setShowResult(false)
    setRotation(0)

    const nothingIndex = prizes.findIndex(p => p.name === 'Ничего')
    const targetRotation =
      360 * 5 + (360 - (nothingIndex * sectionAngle + sectionAngle / 2))

    setTimeout(() => {
      setRotation(targetRotation)

      setTimeout(() => {
        setPrize(prizes[nothingIndex].name)
        setShowResult(true)
        setIsSpinning(false)
        localStorage.setItem(LOCAL_STORAGE_KEY, Date.now().toString())
      }, 3000)
    }, 50)
  }

  // ===================== Анимация маленького вращения =====================
  useEffect(() => {
    if (!isSpinning) {
      const interval = setInterval(() => {
        setRotation(prev => (prev + 0.2) % 360)
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isSpinning])

  return (
    <div className="wheel-tab-con px-4 pb-24 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen flex flex-col items-center">
      <div className="pt-2 space-y-1 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">БЕСПЛАТНОЕ КОЛЕСО</h1>
        <div className="text-lg text-gray-600">
          <span className="font-semibold text-gray-900">КРУТИ</span> КОЛЕСО & <span className="font-semibold text-gray-900">ПОЛУЧАЙ</span> ПРИЗЫ
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center relative">
        <div className="w-6 h-6 bg-red-500 clip-triangle absolute -top-3 z-10" style={{ transform: 'rotate(180deg)' }}></div>

        <div className="relative w-64 h-64 rounded-full shadow-2xl bg-white overflow-hidden">
          <div
            className="w-full h-full rounded-full transition-transform ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
              transitionDuration: isSpinning ? '3s' : '0s',
              transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)'
            }}
          >
            {prizes.map((prize, index) => (
              <div key={index} className="absolute w-full h-full" style={{ transform: `rotate(${index * sectionAngle}deg)`, transformOrigin: 'center' }}>
                <div
                  className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left flex items-center justify-center rounded-l-3xl"
                  style={{
                    background: index % 2 === 0
                      ? 'linear-gradient(135deg,#5ac8fa,#007aff)'
                      : 'linear-gradient(135deg,#34c759,#30d158)'
                  }}
                >
                  <Image src={prize.image} alt={prize.name} width={50} height={50} className="transform -rotate-45 drop-shadow-xl" />
                </div>
              </div>
            ))}

            <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full shadow-inner border border-gray-200 transform -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 w-64">
        {prizes.map((p, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-md p-3 flex flex-col items-center text-gray-800">
            <Image src={p.image} alt={p.name} width={36} height={36} className="mb-1" />
            <span className="text-sm font-medium">{p.name}</span>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showResult && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResult(false)}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              <div className="bg-white rounded-3xl p-6 shadow-2xl w-[90%] max-w-md h-[50vh] flex flex-col">
                <div className="w-16 h-2 bg-gray-300 rounded-full mx-auto mb-4 cursor-pointer" onClick={() => setShowResult(false)}></div>
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">ЭХ!</h2>
                <div className="flex flex-col items-center justify-center flex-1">
                  <Image src={nothing} alt={prize} width={100} height={100} className="mb-4 drop-shadow-xl" />
                  <p className="text-xl text-center text-gray-800">
                    К сожалению, вы <span className="font-bold text-red-600">НИЧЕГО</span> не выиграли.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spin Button */}
      <div className="fixed bottom-[80px] left-0 right-0 py-4 flex flex-col items-center">
        <button
          onClick={spinWheel}
          disabled={isSpinning || cooldown > 0}
          className={`w-full max-w-md py-4 rounded-xl text-lg font-semibold transition-all duration-300 mb-2 ${
            isSpinning || cooldown > 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white shadow-xl hover:bg-blue-600'
          }`}
        >
          {isSpinning
            ? 'Крутим...'
            : cooldown > 0
            ? `Крутить (${formatTime(cooldown)})`
            : 'Крутить'}
        </button>
      </div>

      <style jsx>{`
        .clip-triangle {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
      `}</style>
    </div>
  )
}

export default WheelTab
