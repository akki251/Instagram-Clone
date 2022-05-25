/* eslint-disable @next/next/no-img-element */
import React from 'react';

function Story({ img, username }) {
  return (
    <div>
      {
        <div className="w-20 h-20">
          <img
            className="rounded-full w-16 h-16 p[1.5px] border-red-500 border-2 object-contain cursor-pointer hover:scale-110  transition-all duration-200 ease-in-out"
            src={img}
            alt={username}
          />
          <p className="text-xs w-14 truncate mt-2 font-semibold  text-center">{username}</p>
        </div>
      }
    </div>
  );
}

export default Story;
