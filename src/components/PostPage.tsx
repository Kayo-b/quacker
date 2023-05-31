import React from 'react'
import { useParams, useLocation } from 'react-router-dom';
import Post from "./Post";
import Like from './Like'
import BookmarkBtn from './BookmarkBtn';
import myImg from '../img/user-icon.png';

import { DocumentData } from 'firebase/firestore';


type UserProps = {
    authProvider?: string;
    email: string;
    name?: string;
    uid: string;
    bookmarks?: Array<string>;
}  

type PostProps = {
    post?: DocumentData;
    user: UserProps;
    posts: DocumentData[];
    update: undefined | boolean;
    name: string;
    newPost: DocumentData[] ;
    setNewPost: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    bookmarkPosts?: DocumentData[];
    setBookmarkPosts: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    setUpdate: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

const PostPage: React.FC<PostProps> = ({user, update, posts, name, bookmarkPosts, newPost, setNewPost, setBookmarkPosts, setUpdate}) => {

//   const postID = useParams<{postID: string}>()
  const location = useLocation() as { state: { post: DocumentData } };
  const post = location.state?.post
  const isComment = true;
 
  return (
    // <div>
    //     <div className="post-container" key={post.postID} style={style}>
    //     <div className="user-container" >
    //       <img className="profile-picture" alt="user icon" src={myImg}></img>
    //       <span>
    //         <div className="user-name">
    //           {post.username}
    //         </div>
    //       <div className="content">
    //         <li key={post.id}>
    //           {post.textContent}
    //         </li>
    //       </div>
    //       </span>   
    //     </div>
    //     <Like user={user} post={post}/> 
    //     <BookmarkBtn user={user} post={post} update={update} setUpdate={setUpdate}/>
    //   </div>
      <div>
      <div>
      {/* <Post 
          name={name}
          update={update}
          setUpdate={setUpdate}
          posts={posts}
          user={user}
          bookmarkPosts={bookmarkPosts} 
          setBookmarkPosts={setBookmarkPosts}
          setNewPost={setNewPost}
          newPost={newPost}
          post={post}
          isComment={isComment}
          parentPost={post}
          /> */}
      <Post 
          name={name}
          update={update}
          setUpdate={setUpdate}
          posts={posts}
          user={user}
          bookmarkPosts={bookmarkPosts} 
          setBookmarkPosts={setBookmarkPosts}
          setNewPost={setNewPost}
          newPost={newPost}
          post={post}
          isComment={isComment}
          parentPost={post}
          />
      </div>
      {/* {posts.map(comment => comment.parentID === post.postID ? 
                  <div className="post-container" key={comment.postID}>
                  <div className="user-container">
                    <img className="profile-picture" alt="user icon" src={myImg}></img>
                    <span>
                      <div className="user-name">
                        {comment.username}
                      </div>
                    <div className="content">
                      <li key={comment.id}>
                        {comment.textContent}
                      </li>
                    </div>
                    </span>   
                  </div>
                  <Like user={user} post={comment}/> 
                  <BookmarkBtn user={user} post={comment} update={update} setUpdate={setUpdate}/>
                </div>
                : <></>

      )} */}
    </div>
  )
}

export default PostPage