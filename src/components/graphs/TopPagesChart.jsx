export default function TopPagesChart({ data }) {
  return (
    <div
      className="card"
      /* Use existing “card” class from your stylesheet for radius & shadow */
    >
      <h2 className="text-xl font-bold mb-4">Top Pages by Screen</h2>
      {/* Column headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          fontWeight: 'var(--font-medium)',
          paddingBottom: '12px',
          borderBottom: '2px solid var(--color-gray-300)',
          marginBottom: '12px'
        }}
      >
        <div>Screen</div>
        <div style={{ textAlign: 'center' }}>Event Count</div>
        <div style={{ textAlign: 'right' }}>Unique Users</div>
      </div>
      {/* Data rows */}
      <div className="space-y-2">
        {data.map((page, index) => (
          <div
            key={index}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              alignItems: 'center',
              padding: 'var(--space-3) 0',
              borderBottom: '1px solid var(--color-gray-200)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span
                className={`badge ${index === 0 ? 'badge-primary' : 'badge-secondary'}`}
                style={{ marginRight: 'var(--space-2)' }}
              >
                {index + 1}
              </span>
              <span style={{ fontWeight: 'var(--font-medium)' }}>
                {page.screen_name}
              </span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontWeight: 'var(--font-semibold)' }}>
                {page.event_count}
              </span>
              <span style={{ color: 'var(--color-gray-500)', marginLeft: 'var(--space-1)' }}>
                events
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontWeight: 'var(--font-semibold)' }}>
                {page.user_count}
              </span>
              <span style={{ color: 'var(--color-gray-500)', marginLeft: 'var(--space-1)' }}>
                users
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}