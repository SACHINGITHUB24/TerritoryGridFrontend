
'use client'

interface Activity { ownerId: string; x: number; y: number; color: string }
interface Props { activities: Activity[] }

export default function ActivityFeed({ activities }: Props) {
  return (
    <div style={{
      width: '100%',
      maxWidth: '220px',
      flexShrink: 0,
      minWidth: '180px'
    }}>
      <p style={{ color: '#555', fontSize: '11px', letterSpacing: '2px', marginBottom: '16px' }}>ACTIVITY</p>
      {activities.slice(0, 8).map((a, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '13px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.color, flexShrink: 0 }} />
          <span style={{ color: '#fff', fontWeight: 600 }}>{a.ownerId.slice(0, 8)}</span>
          <span style={{ color: '#555' }}>captured ({a.x}, {a.y})</span>
        </div>
      ))}
    </div>
  )
}