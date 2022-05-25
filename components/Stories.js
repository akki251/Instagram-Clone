import React from 'react';

import { faker } from '@faker-js/faker';
import { useEffect, useState } from 'react';
import Story from './Story';
import { useSession } from 'next-auth/react';

function Stories() {
  const { data: session } = useSession();
  const [suggestion, setSuggestions] = useState([]);

  useEffect(() => {
    const suggestions = [...Array(20)].map((_, i) => ({
      ...faker.helpers.contextualCard(),
      id: i,
    }));

    setSuggestions(suggestions);
  }, []);

  return (
    <div className="flex shadow-md rounded-md space-x-2 p-6 bg-white mt-8 border-gray-200 overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-200">
      {session && <Story img={session.user.image} username={session.user.username} />}
      {suggestion.map((profile) => {
        return <Story key={profile.id} img={profile.avatar} username={profile.username} />;
      })}
    </div>
  );
}

export default Stories;
