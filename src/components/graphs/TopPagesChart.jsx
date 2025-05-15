export default function TopPagesChart({ data }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Top Pages by Screen</h2>
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
                {page.unique_user_count}
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