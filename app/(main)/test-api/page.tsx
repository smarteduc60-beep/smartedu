'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function TestAPIPage() {
  const { data: session, status } = useSession();
  const [usersData, setUsersData] = useState<any>(null);
  const [dbData, setDbData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      // Test Users API
      fetch('/api/users')
        .then(res => res.json())
        .then(data => {
          console.log('Users API Response:', data);
          setUsersData(data);
        })
        .catch(err => {
          console.error('Users API Error:', err);
          setError(err.message);
        });

      // Test Database API
      fetch('/api/database/inspect')
        .then(res => res.json())
        .then(data => {
          console.log('Database API Response:', data);
          setDbData(data);
        })
        .catch(err => {
          console.error('Database API Error:', err);
        });
    }
  }, [status]);

  if (status === 'loading') {
    return <div className="p-8">Loading session...</div>;
  }

  if (status === 'unauthenticated') {
    return <div className="p-8">Please login first</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">API Test Page</h1>

      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">Session Data:</h2>
          <pre className="text-sm overflow-auto">{JSON.stringify(session, null, 2)}</pre>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">Users API Response:</h2>
          {error && <div className="text-red-500 mb-2">Error: {error}</div>}
          <pre className="text-sm overflow-auto">{JSON.stringify(usersData, null, 2)}</pre>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">Database API Response:</h2>
          <pre className="text-sm overflow-auto">{JSON.stringify(dbData, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
