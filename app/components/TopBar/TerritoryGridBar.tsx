
'use client'
import React from 'react'

const USER_COLOR = '#a855f7'

interface Props {
  claimed: number
  total: number
  onlineUsers: number
  topPlayerPercent: number
  userId: string
}

export default function TerritoryGridBar({ claimed, total, onlineUsers, topPlayerPercent, userId }: Props) {
  return (
    <>
      {/* top navbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        height: '48px',
        background: '#111',
        borderBottom: '1px solid #222',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }} />
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>TerritoryGrid</span>
        </div>
        <div style={{ color: '#fff', fontSize: '15px' }}>
          <span style={{ fontWeight: 700 }}>{claimed}</span>
          <span style={{ color: '#666' }}> / {total} claimed</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: '#fff', fontSize: '14px' }}>{userId}</span>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: USER_COLOR }} />
        </div>
      </div>

      {/* bottom stats bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '12px 16px',
        background: '#111',
        borderTop: '1px solid #222',
        fontSize: '14px',
        color: '#888',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <span><span style={{ color: '#fff', fontWeight: 700 }}>{claimed}</span> tiles claimed out of {total}</span>
        <span><span style={{ color: '#fff', fontWeight: 700 }}>{onlineUsers}</span> players online</span>
        <span>Top player controls <span style={{ color: '#fff', fontWeight: 700 }}>{topPlayerPercent}%</span> of the board</span>
      </div>
    </>
  )
}