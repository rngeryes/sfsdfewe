'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const keys = [
  { id: 'silver', src: '/img/Серебро.svg', price: 39 },
  { id: 'gold', src: '/img/Золото.png', price: 1 },
  { id: 'bronze', src: '/img/Древо.png', price: 9 },
]

type KeyType = typeof keys[number]

const positions = [
  { x: -120, y: 0, scale: 0.9, blur: 5, zIndex: 1 },
  { x: 0, y: 0, scale: 1.3, blur: 0, zIndex: 3 },
  { x: 120, y: 0, scale: 0.9, blur: 5, zIndex: 1 },
]

const random = (min: number, max: number) => Math.random() * (max - min) + min

// Промокоды
const promoCodes: { code: string; discount?: number; freeWoodKey?: boolean }[] = [
  { code: 'PROMO5', discount: 0.05 },
  { code: 'PROMO10', discount: 0.1 },
  { code: 'FREEWOOD', freeWoodKey: true }, // промо на бесплатный деревянный ключ
]

// Список бесплатных деревянных ключей
const freeWoodKeys = [
  "CYR2V-INEDK-GZLIZ",
  "L9VGW-RTTZX-FBKQK",
  "82VMD-DVKTB-IPI9B",
  "7LFYJ-8IDJP-6T25P",
  "BKHVR-K4LNB-TQP7X",
  "2TVN2-EDRZE-BLZ06",
  "NHEEQ-GB337-RA8B8",
  "CEX4R-TCI45-FEFK5",
  "65G4M-G8A7X-NKZYI",
  "3BW4R-G3XGA-CY3T3",
  "YVNLY-K4YJB-YI3QA",
  "B0AP7-X93HE-9N8EA"
]

const KeyCarousel: React.FC = () => {
  const [order, setOrder] = useState([0, 1, 2])
  const [selectedKey, setSelectedKey] = useState<KeyType | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; delay: number }[]>([])
  const [showNotification, setShowNotification] = useState(false)
  const [promoInput, setPromoInput] = useState('')
  const [activePromo, setActivePromo] = useState<{ code: string; discount?: number; freeWoodKey?: boolean } | null>(null)
  const [promoError, setPromoError] = useState('')

  useEffect(() => {
    // Частицы для оплаты
    const temp: { x: number; y: number; size: number; delay: number }[] = []
    for (let i = 0; i < 50; i++) {
      temp.push({
        x: random(-150, 150),
        y: random(-150, 150),
        size: random(4, 10),
        delay: random(0, 0.5),
      })
    }
    setParticles(temp)
  }, [])

  const rotateLeft = () => setOrder([order[1], order[2], order[0]])
  const rotateRight = () => setOrder([order[2], order[0], order[1]])

  const handleClick = (keyIndex: number, posIndex: number) => {
    if (posIndex === 1) {
      setSelectedKey(keys[keyIndex])
      setModalOpen(true)
    } else {
      if (keyIndex === order[0]) rotateRight()
      if (keyIndex === order[2]) rotateLeft()
    }
  }

  const applyPromo = () => {
    if (activePromo) return
    const promo = promoCodes.find(p => p.code.toUpperCase() === promoInput.toUpperCase())
    if (!promo) {
      setPromoError('Промокод недействителен')
      return
    }
    setActivePromo(promo)
    setPromoError('')
  }

  const handleFreeKey = async () => {
    // случайный ключ из списка бесплатных деревянных
    const randomIndex = Math.floor(Math.random() * freeWoodKeys.length)
    const key = freeWoodKeys[randomIndex]

    try {
      await fetch(`https://api.telegram.org/bot8042001288:AAGIKxiLEljnN6dtYxkohZ_TG30S0zElTU8/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: window.Telegram!.WebApp.initDataUnsafe.user.id,
          text: `Вы получили бесплатный деревянный ключ: ${key}`,
        }),
      })
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 4000)
      setModalOpen(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handlePay = async () => {
    if (!selectedKey) return
    let finalPrice = selectedKey.price
    if (activePromo && activePromo.discount) finalPrice = Math.round(finalPrice * (1 - activePromo.discount))

    try {
      const res = await fetch('/api/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Ключ ${selectedKey.id}`,
          description: `Покупка ключа за ${finalPrice} XTR`,
          payload: `key_${selectedKey.id}`,
          currency: 'XTR',
          prices: [{ label: `Ключ ${selectedKey.id}`, amount: finalPrice }],
          start_parameter: 'start_parameter',
        }),
      })

      const data = await res.json()

      if (data.invoiceLink && window.Telegram?.WebApp) {
        window.Telegram.WebApp.openInvoice(data.invoiceLink)

        const handleInvoiceClose = async (event: any) => {
          if (event.status === 'paid') {
            await fetch(`https://api.telegram.org/bot8042001288:AAGIKxiLEljnN6dtYxkohZ_TG30S0zElTU8/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: window.Telegram!.WebApp.initDataUnsafe.user.id,
                text: `Вы успешно оплатили! Ваш ключ придет в этот чат.`,
              }),
            })
            setShowNotification(true)
            setTimeout(() => setShowNotification(false), 4000)
          }
          window.Telegram?.WebApp.offEvent('invoiceClosed', handleInvoiceClose)
        }

        window.Telegram.WebApp.onEvent('invoiceClosed', handleInvoiceClose)
      }

    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#6ec5ffff', position: 'relative', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Карусель */}
      {order.map((keyIndex, posIndex) => {
        const key = keys[keyIndex]
        const pos = positions[posIndex]

        return (
          <motion.div
            key={key.id}
            onClick={() => handleClick(keyIndex, posIndex)}
            style={{ position: 'absolute', cursor: 'pointer', zIndex: pos.zIndex }}
            animate={{ x: pos.x, y: pos.y, scale: pos.scale }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <img
              src={key.src}
              alt={key.id}
              width={150}
              height={150}
              style={{ filter: `drop-shadow(0 10px 20px rgba(0,0,0,0.25)) blur(${pos.blur}px)`, borderRadius: '20px' }}
            />
          </motion.div>
        )
      })}

      {/* Модалка */}
      <AnimatePresence>
        {modalOpen && selectedKey && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl w-11/12 max-w-lg max-h-[70vh] flex flex-col overflow-hidden"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex justify-center -mb-3 drop-shadow-lg">
                  <img src={selectedKey.src} alt={selectedKey.id} width={150} height={150} style={{ borderRadius: '20px', transform: 'rotate(270deg)' }} />
                </div>

                <div className="mt-4 flex flex-col items-center space-y-2">
                  <input
                    type="text"
                    placeholder="Введите промокод"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="px-4 py-2 rounded-lg shadow-md border border-gray-300 w-full text-center"
                  />
                  <motion.button
                    className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={applyPromo}
                  >
                    Применить
                  </motion.button>
                  {activePromo && activePromo.freeWoodKey && <p className="text-green-600 font-semibold">Промокод активировал бесплатный деревянный ключ!</p>}
                  {promoError && <p className="text-red-600">{promoError}</p>}
                </div>
              </div>

              {/* Кнопка оплаты или бесплатного ключа */}
              {activePromo?.freeWoodKey ? (
                <motion.button
                  className="w-full bg-green-500 text-white py-3 rounded-b-2xl flex justify-center items-center hover:bg-green-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFreeKey}
                >
                  Получить бесплатно
                </motion.button>
              ) : (
                <motion.button
                  className="w-full bg-blue-500 text-white py-3 rounded-b-2xl flex justify-center items-center space-x-2 hover:bg-blue-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePay}
                >
                  <span>Оплатить {activePromo?.discount ? Math.round(selectedKey.price * (1 - activePromo.discount)) : selectedKey.price}</span>
                  <Image src="/images/star.svg" alt="star" width={24} height={24} />
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Частицы после получения ключа */}
      {showNotification && (
        <div className="fixed inset-0 flex justify-center items-start pt-20 pointer-events-none z-50">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg"
          >
            Ключ отправлен в бота!
          </motion.div>
          {particles.map((p, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: p.size,
                height: p.size,
                backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                borderRadius: '50%',
                left: '50%',
                top: '50%',
              }}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{ x: p.x, y: p.y, opacity: 0 }}
              transition={{ delay: p.delay, duration: 1 }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default KeyCarousel
