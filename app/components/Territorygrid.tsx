
'use client'
import React, { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const GRID_SIZE = 40
const TOTAL = GRID_SIZE * GRID_SIZE

const BOT_COLORS: Record<string, string> = {
  bot_alpha: '#f97316',
  bot_beta:  '#eab308',
  bot_gamma: '#22c55e',
  bot_delta: '#ec4899',
}

function getColor(ownerId: string, myId: string): string {
  if (ownerId === myId) return '#a855f7'
  if (BOT_COLORS[ownerId]) return BOT_COLORS[ownerId]
  const hash = ownerId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return ['#ef4444', '#3b82f6', '#06b6d4', '#f59e0b'][hash % 4]
}

interface Props {
  userId: string
  onStatsUpdate: (claimed: number, online: number, topPercent: number) => void
  onActivity: (entry: { ownerId: string; x: number; y: number; color: string }) => void
  onLeaderboard: (lb: { userId: string; count: number }[]) => void
}

export default function TerritoryGrid({ userId, onStatsUpdate, onActivity, onLeaderboard }: Props) {
  const [blockOwners, setBlockOwners] = useState<Record<number, string>>({})
  const [recentlyClaimed, setRecentlyClaimed] = useState<Set<number>>(new Set())
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const socket = io('https://territorygridbackend-production.up.railway.app')
    socketRef.current = socket

    socket.on('init', (blocks: { id: number; ownerId: string }[]) => {
      const map: Record<number, string> = {}
      blocks.forEach((b) => (map[b.id] = b.ownerId))
      setBlockOwners(map)

      const counts: Record<string, number> = {}
      blocks.forEach((b) => { if (b.ownerId) counts[b.ownerId] = (counts[b.ownerId] || 0) + 1 })
      const topCount = Math.max(0, ...Object.values(counts))
      const topPercent = +((topCount / TOTAL) * 100).toFixed(1)
      onStatsUpdate(blocks.length, 0, topPercent)

      const lb = Object.entries(counts)
        .map(([id, count]) => ({ userId: id, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
      onLeaderboard(lb)
    })

    socket.on('grid_reset', () => {
      console.log('RESET RECEIVED — clearing UI')
      setBlockOwners({})
      setRecentlyClaimed(new Set())
      onStatsUpdate(0, 0, 0)
      onLeaderboard([])
    })

    socket.on('block_updated', ({ blockId, ownerId }: { blockId: number; ownerId: string }) => {
      setBlockOwners((prev) => {
        const next = { ...prev, [blockId]: ownerId }

        const counts: Record<string, number> = {}
        Object.values(next).forEach((o) => { if (o) counts[o] = (counts[o] || 0) + 1 })
        const claimed = Object.values(counts).reduce((a, b) => a + b, 0)
        const topCount = Math.max(0, ...Object.values(counts))
        const topPercent = +((topCount / TOTAL) * 100).toFixed(1)
        onStatsUpdate(claimed, 0, topPercent)

        const lb = Object.entries(counts)
          .map(([id, count]) => ({ userId: id, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
        onLeaderboard(lb)

        return next
      })

      const x = blockId % GRID_SIZE
      const y = Math.floor(blockId / GRID_SIZE)
      onActivity({ ownerId, x, y, color: getColor(ownerId, userId) })

      setRecentlyClaimed((prev) => new Set(prev).add(blockId))
      setTimeout(() => {
        setRecentlyClaimed((prev) => {
          const next = new Set(prev)
          next.delete(blockId)
          return next
        })
      }, 500)
    })

    socket.on('online_count', (count: number) => {
      onStatsUpdate(0, count, 0)
    })

    return () => {
      socket.off('grid_reset')
      socket.disconnect()
    }
  }, [userId])

  const handleBlockClick = (index: number) => {
    const x = index % GRID_SIZE
    const y = Math.floor(index / GRID_SIZE)
    socketRef.current?.emit('claim_block', { blockId: index, x, y, userId })
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
      width: '100%',
      maxWidth: '560px',
      aspectRatio: '1',
      gap: '1px',
      background: '#2a2a2a',
      border: '1px solid #333',
      overflow: 'visible',
      flexShrink: 0,
    }}>
      {Array.from({ length: TOTAL }).map((_, index) => {
        const owner = blockOwners[index]
        const isAnimating = recentlyClaimed.has(index)
        return (
          <div
            key={index}
            onClick={() => handleBlockClick(index)}
            style={{
              position: 'relative',
              cursor: 'pointer',
              zIndex: isAnimating ? 10 : 1,
              backgroundColor: owner ? getColor(owner, userId) : '#1a1a1a',
              transition: 'transform 0.15s ease, background-color 0.15s ease',
              transform: isAnimating ? 'scale(1.6)' : 'scale(1)',
            }}
          />
        )
      })}
    </div>
  )
// }

