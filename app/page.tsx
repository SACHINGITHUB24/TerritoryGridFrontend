
'use client'
import { useState } from 'react'
import TerritoryGrid from './components/Territorygrid'
import TerritoryGridBar from './components/TopBar/TerritoryGridBar'
import ActivityFeed from './components/Activity/AsctivityFeed'
import Leaderboard from './components/Leaderboard/Leaderboard'

const TOTAL = 40 * 40

export default function Page() {
  const [userId] = useState(() => 'user_' + Math.random().toString(36).slice(2, 7))
  const [claimed, setClaimed] = useState(0)
  const [online, setOnline] = useState(1)
  const [topPercent, setTopPercent] = useState(0)
  const [leaderboard, setLeaderboard] = useState<{ userId: string; count: number }[]>([])
  const [activities, setActivities] = useState<{ ownerId: string; x: number; y: number; color: string }[]>([])

  const handleStats = (c: number, o: number, t: number) => {
    if (c > 0) setClaimed(c)
    if (o > 0) setOnline(o)
    if (t > 0) setTopPercent(t)
  }

  const handleActivity = (entry: { ownerId: string; x: number; y: number; color: string }) => {
    setActivities((prev) => [entry, ...prev].slice(0, 8))
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: '#111',
      overflow: 'hidden'
    }}>
      <TerritoryGridBar
        claimed={claimed}
        total={TOTAL}
        onlineUsers={online}
        topPlayerPercent={topPercent}
        userId={userId}
      />
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        padding: '16px',
        flexWrap: 'wrap',
        overflow: 'auto'
      }}>
        <Leaderboard entries={leaderboard} myId={userId} />
        <TerritoryGrid
          userId={userId}
          onStatsUpdate={handleStats}
          onActivity={handleActivity}
          onLeaderboard={setLeaderboard}
        />
        <ActivityFeed activities={activities} />
      </div>
    </div>
  )
}