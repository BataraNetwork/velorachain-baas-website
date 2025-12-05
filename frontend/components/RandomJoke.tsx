import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function RandomJoke() {
  const [joke, setJoke] = useState<{ setup?: string; punchline?: string }>({});
  const [loading, setLoading] = useState(false);

  const fetchJoke = async () => {
    setLoading(true);
    setJoke({});
    try {
      const res = await fetch('/api/joke');
      const data = await res.json();
      setJoke(data);
    } catch {
      setJoke({ setup: 'Oops!', punchline: 'Failed to fetch joke.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4 border rounded">
      <Button onClick={fetchJoke} disabled={loading}>
        {loading ? 'Loading...' : 'Get Random Joke'}
      </Button>
      {joke.setup && (
        <div className="mt-4">
          <div className="font-semibold">{joke.setup}</div>
          <div className="mt-2">{joke.punchline}</div>
        </div>
      )}
    </div>
  );
}