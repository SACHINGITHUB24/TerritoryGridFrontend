
'use client'

interface Entry { userId: string; count: number }
interface Props { entries: Entry[]; myId: string }

const USER_COLORS: Record<string, string> = {
  bot_alpha: '#f97316', bot_beta: '#eab308', bot_gamma: '#22c55e', bot_delta: '#ec4899',
}
function getColor(id: string, myId: string) {
  if (id === myId) return '#a855f7'
  if (USER_COLORS[id]) return USER_COLORS[id]
  const hash = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return ['#ef4444','#3b82f6','#06b6d4','#f59e0b'][hash % 4]
}

const TOTAL = 40 * 40

export default function Leaderboard({ entries, myId }: Props) {
  return (
    <div style={{
      width: '100%',
      maxWidth: '200px',
      flexShrink: 0,
      minWidth: '180px'
    }}>
      <p style={{ color: '#555', fontSize: '11px', letterSpacing: '2px', marginBottom: '16px' }}>LEADERBOARD</p>
      {entries.map((e, i) => (
        <div key={e.userId} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <span style={{ color: '#555', fontSize: '13px', width: '12px' }}>{i + 1}</span>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: getColor(e.userId, myId), flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#fff', fontSize: '13px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {e.userId}
            </div>
            <div style={{ color: '#555', fontSize: '11px' }}>{((e.count / TOTAL) * 100).toFixed(1)}%</div>
          </div>
          <span style={{ color: '#fff', fontSize: '13px' }}>{e.count}</span>
        </div>
      ))}
    </div>
  )
}