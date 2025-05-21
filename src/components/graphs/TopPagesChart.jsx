export default function TopPagesChart({ data }) {
  return (
    <div
      className="card"
    /* Use existing “card” class from your stylesheet for radius & shadow */
    >
      {/* Flexbox layout for title and actions */}
      <div className="flex justify-between items-center mb-3">
        <div className="card-title">Top Pages By Events</div>
        <div className="card-actions">
           <div className="relative group">
            <button className="btn btn-secondary btn-sm flex items-center">
              <i className="fas fa-download mr-1"></i> Export
            </button>
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-sm text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
              In Progress
            </div>
          </div>
        </div>
      </div>
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