import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { DocumentData } from 'firebase/firestore';
import { db } from "../firebase";
import Like from './Like'
import BookmarkBtn from './BookmarkBtn';
import PostPage from './PostPage';
import Comment from './Comment';
import myImg from '../img/user-icon.png';


type UserProps = {
  authProvider?: string;
  email: string;
  name?: string;
  uid: string;
  bookmarks?: Array<string>;
}  

type PostProps = {
    name: string;
    setNewPost: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    newPost: DocumentData[] ;
    posts: DocumentData[] ;
    update: undefined | boolean;
    setUpdate: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    user: UserProps;
    bookmarkPosts?: DocumentData[];
    setBookmarkPosts: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    isComment?: boolean | undefined;
    parentPost?: DocumentData;
}

const Post: React.FC<PostProps> = ({ 
  name,
  update, 
  newPost, 
  setNewPost,
  posts, 
  setUpdate, 
  user, 
  bookmarkPosts, 
  setBookmarkPosts,
  isComment,
  parentPost }) => {

  const navigate = useNavigate();
  
  const RedirectToPostPage = (post: DocumentData) => {
    navigate(`/post/${post.postID}`, {state: {post}})
    
  }

    let neuPost = newPost.map(post =>  post.parentID === null ?  
      <div className="post-container" key={post.postID}>
        <div className="user-container">
          <img className="profile-picture" alt="user icon" src={myImg}></img>
          <span>
            <div className="user-name">
              {post.username}
            </div>
          <div className="content" onClick={() => RedirectToPostPage(post)}>
            <li key={post.id}>
              {post.textContent}
            </li>
          </div>
          </span>   
        </div>
        <Like 
        user={user} 
        post={post}
        /> 
        <BookmarkBtn 
        user={user} 
        post={post} 
        update={update} 
        setUpdate={setUpdate}
        />
        <Comment 
         user={user}
         post={post}
         setUpdate={setUpdate}
         setNewPost={setNewPost}
         newPost={newPost}
         update={update}
         name={name}
        />
      </div>
      : <></>
    )
    let loadPosts = posts.map(post => post.parentID === null ?
      <div className="post-container" key={post.postID}>
        <div className="user-container">
          <img className="profile-picture" alt="user icon" src={myImg}></img>
          <span>
            <div className="user-name">
              {post.username}
            </div>
          <div className="content" onClick={() => RedirectToPostPage(post)}>
            <li key={post.id}>
              {post.textContent}
            </li>
          </div>
          </span>
        </div>
        <Like 
        user={user} 
        post={post}
        /> 
        <BookmarkBtn 
        // key={post.postID}
        user={user} 
        post={post} 
        update={update} 
        setUpdate={setUpdate}
        bookmarkPosts={bookmarkPosts} 
        setBookmarkPosts={setBookmarkPosts}
        />
        <Comment
        user={user}
        post={post}
        setUpdate={setUpdate}
        setNewPost={setNewPost}
        newPost={newPost}
        update={update}
        name={name}
        />
      </div>
      : <></>
    )
    
    let comment = posts.map(post =>  post.parentID === parentPost?.postID ?  
      <div className="post-container" key={post.postID}>
        <div className="user-container">
          <img className="profile-picture" alt="user icon" src={myImg}></img>
          <span>
            <div className="user-name">
              {post.username}
            </div>
          <div className="content" onClick={() => RedirectToPostPage(post)}>
            <li key={post.id}>
              {post.textContent}
            </li>
          </div>
          </span>   
        </div>
        <Like 
        user={user} 
        post={post}
        /> 
        <BookmarkBtn 
        user={user} 
        post={post} 
        update={update} 
        setUpdate={setUpdate}
        />
        <Comment 
         user={user}
         post={post}
         setUpdate={setUpdate}
         setNewPost={setNewPost}
         newPost={newPost}
         update={update}
         name={name}
        />
      </div>
      : <></>
    )

    return (
      <div>
        {isComment ? (
          <div>{comment}</div>
        ) : (
          <div>
            <div>{neuPost}</div>
            <div>{loadPosts}</div>
          </div>
        )}
      </div>
    );
  
}

export default Post