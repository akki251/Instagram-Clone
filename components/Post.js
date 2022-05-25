/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';

import {
  BookmarkIcon,
  ChatIcon,
  DotsCircleHorizontalIcon,
  EmojiHappyIcon,
  HeartIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/outline';

import { HeartIcon as HeartIconFilled, SaveIcon } from '@heroicons/react/solid';
import { useSession } from 'next-auth/react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import Moment from 'react-moment';

function Post({ img, userImg, caption, id, username }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [likes, setLikes] = useState([]);

  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    onSnapshot(collection(db, 'posts', id, 'likes'), (snapshot) => setLikes(snapshot.docs));
  }, [db, id]);

  useEffect(() => {
    return onSnapshot(
      query(collection(db, 'posts', id, 'comments'), orderBy('timeStamp', 'desc')),
      (snapshot) => {
        setComments(snapshot.docs);
      },
    );
  }, [db, id]);

  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === session?.user?.uid) !== -1);
  }, [likes]);

  const likePost = async () => {
    if (hasLiked) {
      await deleteDoc(doc(db, 'posts', id, 'likes', session.user.uid));
    } else {
      await setDoc(doc(db, 'posts', id, 'likes', session.user.uid), {
        username: session.user.username,
      });
    }
  };

  const sendComment = async (e) => {
    e.preventDefault();
    const commentToSend = comment;
    setComment('');

    await addDoc(collection(db, 'posts', id, 'comments'), {
      comment: commentToSend,
      username: session.user.username,
      userImage: session.user.image,
      timeStamp: serverTimestamp(),
    });
  };

  const { data: session } = useSession();
  return (
    <div className="bg-white my-7 border rounded-sm shadow-sm">
      {/* HEADER */}
      <div className="flex items-center p-5">
        <img
          src={userImg}
          className="rounded-full h-12 w-12 object-contain border p-1 mr-3"
          alt={username}
        />
        <p className="flex-1 font-bold">{username}</p>
        <DotsCircleHorizontalIcon className="h-5" />
      </div>

      {/* IMG */}
      <img src={img} className="object-cover w-full" alt={username} />

      {/* BUTTONS */}
      {session && (
        <div className="flex justify-between p-3">
          <div className="flex space-x-4 items-center">
            {hasLiked ? (
              <HeartIconFilled onClick={likePost} className="btn text-red-500" />
            ) : (
              <HeartIcon onClick={likePost} className="btn" />
            )}
            <ChatIcon className="btn" />
            <PaperAirplaneIcon className="btn rotate-45" />
          </div>
          <BookmarkIcon className="btn" />
        </div>
      )}

      {/* CAPTION */}
      <p className="p-5 truncate ">
        {likes.length > 0 && <p className="font-bold -mb-1">{likes.length} likes</p>}
        <span className="font-bold mr-1">{username} </span>
        {caption}
      </p>

      {/* COMMENTS */}

      {comments.length > 0 && (
        <div className="ml-10 h-20 overflow-y-scroll scrollbar-thumb-gray-300 scrollbar-thin">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-center space-x-2 mb-3">
              <img
                className="h-7 rounded-full"
                src={comment.data().userImage}
                alt="comment user img"
              />
              <p className="text-sm flex-1">
                <span className="font-bold text-black-100">{comment.data().username}</span>{' '}
                {comment.data().comment}
              </p>
              <Moment fromNow interval={5000} className="pr-5  text-sm">
                {comment.data().timeStamp?.toDate()}
              </Moment>
            </div>
          ))}
        </div>
      )}

      {/* INPUT BOX */}
      {session && (
        <form className="flex items-center space-x-2 p-4">
          <EmojiHappyIcon className="h-7" />
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            type="text"
            placeholder="Add a Comment..."
            className="border-none flex-1 focus:ring-black-100"
          />
          <button
            type="submit"
            disabled={!comment.trim()}
            onClick={sendComment}
            className="font-semi-bold text-blue-400"
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
