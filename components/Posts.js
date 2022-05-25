import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import Post from './Post';

// const posts = [
//   {
//     id: '123',
//     username: 'akki_251',
//     userImg: 'https://i.ibb.co/s5wrMfw/dp.png',
//     img: 'https://i.ibb.co/s5wrMfw/dp.png',
//     caption: 'This is dope post for instagram clone',
//   },
// ];

function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(
    () =>
      onSnapshot(query(collection(db, 'posts'), orderBy('timestamp', 'desc')), (snapshot) => {
        setPosts(snapshot.docs);
      })[db],
  );

  // console.log(posts);

  return (
    <>
      {posts.map((post) => {
        return (
          <Post
            key={post.id}
            id={post.id}
            username={post.data().username}
            userImg={post.data().profileImg}
            caption={post.data().caption}
            img={post.data().image}
          />
        );
      })}
    </>
  );
}

export default Posts;
