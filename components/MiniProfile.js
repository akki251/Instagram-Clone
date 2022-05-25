/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { signOut, useSession } from 'next-auth/react';
import React from 'react';

function MiniProfile() {
  const { data: session } = useSession();
  return (
    <div className="flex items-center justify-between mt-20  ml-10">
      <img src={session?.user?.image} className="rounded-full border p-[2px]  w-16 h-16" />

      <div className="flex-1 mx-4">
        <h2 className="font-bold">{session?.user?.username}</h2>
        <h3 className="text-sm text-gray-400">Welcome to Instagram</h3>
      </div>

      <button onClick={signOut} className="text-blue-400 text-sm">
        Sign out
      </button>
    </div>
  );
}

export default MiniProfile;
