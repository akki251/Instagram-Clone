/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unknown-property */
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState, useRef } from 'react';
import { useRecoilState } from 'recoil';

import { modalState } from '../atoms/modalAtom';
import { CameraIcon } from '@heroicons/react/outline';
import { db, storage } from '../firebase';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { ref, getDownloadURL, uploadString } from 'firebase/storage';
function Modal() {
  const { data: session } = useSession();
  const [isOpenModal, setIsOpenModal] = useRecoilState(modalState);
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef();
  const captionRef = useRef();

  const [selectedFile, setSelectedFile] = useState(null);

  const uploadPost = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    //  1. create a post and to firestore posts collection
    // 2 .get the postID for the newly created post
    // 3 . upload the image to firebase store with post id
    //4 .get a  download url from firebase storage with the post id
    // update the posts page

    const docRef = await addDoc(collection(db, 'posts'), {
      username: session.user.username,
      caption: captionRef.current.value,
      profileImg: session.user.image,
      timestamp: serverTimestamp(),
    });

    console.log('new doc added with id', docRef.id);

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    await uploadString(imageRef, selectedFile, 'data_url').then(async (snapshot) => {
      const downloadUrl = await getDownloadURL(imageRef);
      await updateDoc(
        doc(db, 'posts', docRef.id),

        { image: downloadUrl },
      );
    });

    setIsOpenModal(false);
    setLoading(false);
    setSelectedFile(null);
  };

  const addImageToPost = (e) => {
    e.preventDefault();

    const reader = new FileReader();

    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  return (
    <Transition.Root show={isOpenModal} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setIsOpenModal}>
        <div className="flex items-end justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden  shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm ms:w-full">
              <div>
                {selectedFile ? (
                  <img
                    src={selectedFile}
                    className="w-full object-contain cursor-pointer"
                    alt="uploaded image"
                    onClick={() => setSelectedFile(null)}
                    srcset=""
                  />
                ) : (
                  <div
                    onClick={() => filePickerRef.current.click()}
                    className="mx-auto  flex items-center justify-center h-12 w-12 rounded-full bg-red-100"
                  >
                    <CameraIcon className=" w-6 h-6  text-red-600" aria-hidden="true" />
                  </div>
                )}

                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      Upload photo
                    </Dialog.Title>

                    <div>
                      <input type="file" hidden ref={filePickerRef} onChange={addImageToPost} />
                    </div>
                  </div>
                </div>

                {/* //// caption  */}
                <div className="mt-2">
                  <input
                    ref={captionRef}
                    type="text"
                    className="border-none focus:ring-0 w-full text-center"
                    placeholder="Please enter a caption.."
                  />
                </div>

                <div className="mt-5 sm:mt-6 text-center">
                  <button
                    onClick={uploadPost}
                    disabled={loading || !selectedFile}
                    className="bg-blue-300 p-3 rounded-md"
                    type="button"
                  >
                    {loading ? 'Uploading' : 'Upload Post'}
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default Modal;
