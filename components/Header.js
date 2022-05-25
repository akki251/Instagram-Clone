/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Image from 'next/image';

import {
  HeartIcon,
  MenuIcon,
  PaperAirplaneIcon,
  PlusCircleIcon,
  PlusIcon,
  SearchIcon,
  UserGroupIcon,
} from '@heroicons/react/outline';

import { HomeIcon } from '@heroicons/react/solid';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { modalState } from '../atoms/modalAtom';
function Header() {
  const { data: session } = useSession();

  const [isOpenModal, setIsOpenModal] = useRecoilState(modalState);

  const router = useRouter();

  // console.log(session);
  return (
    <div className="shadow-sm border-b bg-white sticky top-0 z-50">
      <div className="flex justify-between  bg-white max-w-6xl mx-5 xl:mx-auto ">
        {/* LEFT */}
        <div
          onClick={() => router.push('/')}
          className="relative hidden lg:inline-grid w-24  cursor-pointer"
        >
          <Image
            src="https://logos-world.net/wp-content/uploads/2020/04/Instagram-Logo.png"
            layout="fill"
            alt="instagram logo"
            objectFit="contain"
          />
        </div>
        <div className="relative  lg:hidden w-10  after: flex-shrink-0">
          <Image
            src="https://logos-world.net/wp-content/uploads/2020/04/Instagram-Logo.png"
            layout="fill"
            alt="instagram logo"
            objectFit="contain"
          />
        </div>
        {/* MIDDLE  search input field*/}
        <div className="max-w-xs">
          <div className="relative mt-1 p-3 rounder-md  ">
            <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 cursor-pointer w-5 text-gray-500" />
            </div>
            <input
              type="text"
              className=" bg-gray-50 block w-full p-1 focus:ring-black focus:border-black rounded-md pl-10 sm:text-sm border-gray-300"
              placeholder="Search"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-end space-x-4">
          <HomeIcon onClick={() => router.push('/')} className="navBtn" />
          <MenuIcon onClick={() => router.push('/')} className="navBtn" />

          {session ? (
            <>
              <div className="relative navBtn">
                <PaperAirplaneIcon className="navBtn rotate-45" />
                <div className="absolute -top-2 -right-1 text-xs w-5 h-5 bg-red-500 text-center rounded-full text-white">
                  3
                </div>
              </div>
              <PlusCircleIcon onClick={() => setIsOpenModal(true)} className="navBtn" />
              <UserGroupIcon className="navBtn" />
              <HeartIcon className="navBtn" />
              <img
                onClick={signOut}
                src={session?.user?.image}
                alt="profile pic"
                className="rounded-full h-10 cursor-pointer"
              />
            </>
          ) : (
            <button onClick={signIn}>Sign In</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
