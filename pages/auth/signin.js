/* eslint-disable @next/next/no-img-element */
import { getProviders, signIn } from 'next-auth/react';

import React from 'react';
import Header from '../../components/Header';

function SignIn({ providers }) {
  return (
    <>
      <Header />

      <div className="flex flex-col items-center justify-center text-center  mt-40">
        <img
          className="w-80"
          src="https://logos-world.net/wp-content/uploads/2020/04/Instagram-Logo.png"
          alt="instagram logo "
        />
        <div className="mt-5">
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                className="p-3 bg-blue-500 rounded-lg text-white"
                onClick={() => signIn(provider.id, { callbackUrl: '/' })}
              >
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();

  console.log(providers);
  return {
    props: {
      providers,
    },
  };
}

export default SignIn;
