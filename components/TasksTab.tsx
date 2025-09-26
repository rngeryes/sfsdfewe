'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

interface UserProfile {
  first_name?: string
  last_name?: string
  username?: string
  photo_url?: string
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [keysBought, setKeysBought] = useState(0)
  const [starsSpent, setStarsSpent] = useState(0)

  useEffect(() => {
    const storedKeys = localStorage.getItem('keysBought')
    const storedStars = localStorage.getItem('starsSpent')
    setKeysBought(storedKeys ? parseInt(storedKeys) : 0)
    setStarsSpent(storedStars ? parseInt(storedStars) : 0)

    // Telegram WebApp user
    const tgUser = (window as any)?.Telegram?.WebApp?.initDataUnsafe?.user
    if (tgUser) {
      setUser({
        first_name: tgUser.first_name,
        last_name: tgUser.last_name,
        username: tgUser.username,
        photo_url: tgUser.photo_url, // возможное доп. поле
      })
    }
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: '40px',
        height: '100vh',
        backgroundColor: '#6ec5ff',
      }}
    >
      {/* Аватар */}
      <div
        style={{
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          marginBottom: '20px',
        }}
      >
        {user?.photo_url ? (
          <img src={user.photo_url} alt="Avatar" style={{ width: '100%', height: '100%' }} />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              color: '#fff',
            }}
          >
            {user?.first_name?.[0] || '?'}
          </div>
        )}
      </div>

      {/* Никнейм */}
      <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '30px', textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
        {user?.username ? `@${user.username}` : `${user?.first_name || ''} ${user?.last_name || ''}`}
      </h2>

      {/* Статистика */}
      <div
        style={{
          display: 'flex',
          gap: '40px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          padding: '20px 40px',
          borderRadius: '20px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        }}
      >
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Ключи куплено</h3>
          <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{keysBought}</p>
        </div>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Звёзды потрачено</h3>
          <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{starsSpent}</p>
        </div>
      </div>
    </div>
  )
}

export default Profile
