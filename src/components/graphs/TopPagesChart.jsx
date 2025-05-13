export default function TopPagesChart({ data }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Top Pages by Screen</h2>
      <div className="space-y-4">
        {data.map((page, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </span>
              <span className="ml-3">{page.screen_name}</span>
            </div>
            <div className="text-right">
              <div className="font-semibold">{page.event_count} events</div>
              <div className="text-sm text-gray-500">{page.user_count} users</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}