import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { DocumentData } from 'firebase/firestore';
import { db } from "../firebase";
import Like from './Like'
import BookmarkBtn from './BookmarkBtn';
import PostPage from './PostPage';
import Comment from './Comment';
import Repost from './Repost';
import myImg from '../img/user-icon.png';


type UserProps = {
  authProvider?: string;
  email: string;
  name?: string;
  uid: string;
  bookmarks?: Array<string>;
  reposts?: Array<string>;
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
    post?: DocumentData;
    profPost?: boolean;
    profResp?: boolean;
    repost?: DocumentData[];
    setRepost?: React.Dispatch<React.SetStateAction<DocumentData[]>>;
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
  parentPost,
  post,
  profPost,
  profResp,
  repost,
  setRepost}) => {

  const navigate = useNavigate();
  const style = {"fontSize": "large"}
  
  //Getting single post object values and passing them to the postPage URL
  const RedirectToPostPage = (post: DocumentData) => {
    navigate(`/post/${post.postID}`, {state: {post}})
    
  }

  const RedirectToProfilePage = (post: DocumentData | undefined) => {
    navigate(`/profile/${post?.username}`, {state: {post}})
    
  }


  //neuPosts sets the new post directly into the feed, without any server commmunication
  console.log(post?.postID)
    let neuPost = newPost.map(post =>  post.parentID === null ?  
      <div className="post-container" key={post.postID}>
        <div className="user-container">
          <img className="profile-picture" alt="user icon" src={myImg}></img>
          <span>
            <div className="user-name" onClick={() => RedirectToProfilePage(post)}>
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
        <Repost 
         user={user}
         post={post}
         setUpdate={setUpdate}
         setNewPost={setNewPost}
         newPost={newPost}
         update={update}
         name={name}
         repost={repost}
         setRepost={setRepost}
        />
      </div>
      : <></>
    )
    
    //LoadPosts also sets the posts into the feed, but it does it by getting the information from a sql query done in the previous componenet.
    //The separation between both types of setting posts into the feed is because the loadPosts takes long to render because of the query, 
    //so the neuPost was created to inprove the user experience.
    let loadPosts = posts.map(post => post.parentID === null ?
      <div className="post-container" key={post.postID}>
        <div className="user-container">
          <img className="profile-picture" alt="user icon" src={myImg}></img>
          <span>
            <div className="user-name" onClick={() => RedirectToProfilePage(post)}>
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
        <Repost 
         user={user}
         post={post}
         setUpdate={setUpdate}
         setNewPost={setNewPost}
         newPost={newPost}
         update={update}
         name={name}
         repost={repost}
         setRepost={setRepost}
        />
      </div>
      : <></>
    )
    //Comment sets a "sub-post" inside the commented post, its only visible when the parent post is clicked.
    
    let comment = posts.map(post =>  post.parentID === parentPost?.postID ?  
      <div className="post-container" key={post.postID}>
        <div className="user-container">
          <img className="profile-picture" alt="user icon" src={myImg}></img>
          <span>
            <div className="user-name" onClick={() => RedirectToProfilePage(post)}>
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
        <Repost 
         user={user}
         post={post}
         setUpdate={setUpdate}
         setNewPost={setNewPost}
         newPost={newPost}
         update={update}
         name={name}
         repost={repost}
         setRepost={setRepost}
        />
      </div>
      : <></>
    )

    let newComment = newPost.map(post =>  post.parentID === parentPost?.postID ?  
      <div className="post-container" key={post.postID}>
        <div className="user-container">
          <img className="profile-picture" alt="user icon" src={myImg}></img>
          <span>
            <div className="user-name" onClick={() => RedirectToProfilePage(post)}>
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
        <Repost 
         user={user}
         post={post}
         setUpdate={setUpdate}
         setNewPost={setNewPost}
         newPost={newPost}
         update={update}
         name={name}
         repost={repost}
         setRepost={setRepost}
        />
      </div>
      : <></>
    )
    
    let clickedPost =  
      <div className="post-container" key={post?.postID} style={style} >
        <div className="user-container">
          <img className="profile-picture" alt="user icon" src={myImg}></img>
          <span>
            <div className="user-name" onClick={() => RedirectToProfilePage(post)}>
              {post?.username}
            </div>
          <div className="content" >
            <li key={post?.id}>
              {post?.textContent}
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
        <Repost 
         user={user}
         post={post}
         setUpdate={setUpdate}
         setNewPost={setNewPost}
         newPost={newPost}
         update={update}
         name={name}
         repost={repost}
         setRepost={setRepost}
        />
      </div>
//clickedPostParentPost renders the parent post of the clicked post (if it has a parentID)
let newPostValue = post
let clickedPostParentPost =   posts.map(post =>  
  post.postID === newPostValue?.parentID ?  
  <div className="post-container" key={post.postID} style={style}>
    <div className="user-container">
      <img className="profile-picture" alt="user icon" src={myImg}></img>
      <span>
        <div className="user-name" onClick={() => RedirectToProfilePage(post)}>
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
    <Repost 
      user={user}
      post={post}
      setUpdate={setUpdate}
      setNewPost={setNewPost}
      newPost={newPost}
      update={update}
      name={name}
      repost={repost}
      setRepost={setRepost}
    />
  </div>
  : <></>
)
let rootPost =  posts.map(post =>  
  post.postID === newPostValue?.rootPostID &&
  newPostValue?.parentID !== post.postID && 
  newPostValue?.parentID !== null ?  
  <div className="post-container" key={post.postID} style={style}>
    <div className="user-container">
      <img className="profile-picture" alt="user icon" src={myImg}></img>
      <span>
        <div className="user-name" onClick={() => RedirectToProfilePage(post)}>
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
    <Repost 
      user={user}
      post={post}
      setUpdate={setUpdate}
      setNewPost={setNewPost}
      newPost={newPost}
      update={update}
      name={name}
      repost={repost}
      setRepost={setRepost}
    />
  </div>
  : <></>
)
console.log(newPostValue?.userID)
console.log(post?.userID)
let profilePostsFeed =  posts.map(post =>  
  post.userID === newPostValue?.userID &&
  post.parentID === null ?  
  <div className="post-container" key={post.postID} style={style}>
    <div className="user-container">
      <img className="profile-picture" alt="user icon" src={myImg}></img>
      <span>
        <div className="user-name" onClick={() => RedirectToProfilePage(post)}>
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
    <Repost 
      user={user}
      post={post}
      setUpdate={setUpdate}
      setNewPost={setNewPost}
      newPost={newPost}
      update={update}
      name={name}
      repost={repost}
      setRepost={setRepost}
    />
  </div>
  : <></>
)

let profileNewPostsFeed =  newPost.map(post =>  
  post.userID === newPostValue?.userID &&
  post.parentID === null ?  
  <div className="post-container" key={post.postID} style={style}>
    <div className="user-container">
      <img className="profile-picture" alt="user icon" src={myImg}></img>
      <span>
        <div className="user-name" onClick={() => RedirectToProfilePage(post)}>
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
    <Repost 
      user={user}
      post={post}
      setUpdate={setUpdate}
      setNewPost={setNewPost}
      newPost={newPost}
      update={update}
      name={name}
      repost={repost}
      setRepost={setRepost}
    />
  </div>
  : <></>
)

let profileResponsesFeed =  posts.map(post =>  
  post.userID === newPostValue?.userID &&
  post.parentID !== null ?  
  <div className="post-container" key={post.postID} style={style}>
    <div className="user-container">
      <img className="profile-picture" alt="user icon" src={myImg}></img>
      <span>
        <div className="user-name" onClick={() => RedirectToProfilePage(post)}>
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
    <Repost 
      user={user}
      post={post}
      setUpdate={setUpdate}
      setNewPost={setNewPost}
      newPost={newPost}
      update={update}
      name={name}
      repost={repost}
      setRepost={setRepost}
    />
  </div>
  : <></>
)
let profileNewResponsesFeed =  newPost.map(post =>  
  post.userID === newPostValue?.userID &&
  post.parentID !== null ?  
  <div className="post-container" key={post.postID} style={style}>
    <div className="user-container">
      <img className="profile-picture" alt="user icon" src={myImg}></img>
      <span>
        <div className="user-name" onClick={() => RedirectToProfilePage(post)}>
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
    <Repost 
      user={user}
      post={post}
      setUpdate={setUpdate}
      setNewPost={setNewPost}
      newPost={newPost}
      update={update}
      name={name}
      repost={repost}
      setRepost={setRepost}
    />
  </div>
  : <></>
)

console.log(repost)
let repostsFromUser = posts.map(post =>  
  
    //user.reposts?.find(repost => repost === post.postID) 
    post.repostByUsers.includes(newPostValue?.userID) ?
    <div className="post-container" key={post.postID} style={style}>
      <div className="user-container">
        <img className="profile-picture" alt="user icon" src={myImg}></img>
        <span>
          <div className="user-name" onClick={() => RedirectToProfilePage(post)}>
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
      <Repost 
        user={user}
        post={post}
        setUpdate={setUpdate}
        setNewPost={setNewPost}
        newPost={newPost}
        update={update}
        name={name}
        repost={repost}
        setRepost={setRepost}
      />
    </div>
    : <></>
  )

  let newRepostsFromUser = posts.map(post => 
    //repost?.find(repost => repost.postID === post.postID) ?
    repost?.includes(post) ?
    <div className="post-container" key={post.postID} style={style}>
      <div className="user-container">
        <img className="profile-picture" alt="user icon" src={myImg}></img>
        <span>
          <div className="user-name" onClick={() => RedirectToProfilePage(post)}>
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
      <Repost 
        user={user}
        post={post}
        setUpdate={setUpdate}
        setNewPost={setNewPost}
        newPost={newPost}
        update={update}
        name={name}
        repost={repost}
        setRepost={setRepost}
      />
    </div>
    : <><div>BULLSHIT</div></>
  )

console.log(newPostValue)
    return (
      
      <div>
        {isComment ? (
          
          <div>
          <div>{rootPost}</div>
          <div>{clickedPostParentPost}</div>
          <div>{clickedPost}</div>
          <div>{newComment}</div>
          <div>{comment}</div>
          </div>

        ) : profPost === true ? (
          <div>
            <div>PROF POST</div>
            <div>{newRepostsFromUser}</div>
            <div>{profileNewPostsFeed}</div>
            
            <div>{repostsFromUser}</div>
            <div>{profilePostsFeed}</div>
          </div>
        ) : profPost === false ? (
          <div>
            <div>PROF RESP</div>
            <div>{profileNewResponsesFeed}</div>
            <div>{profileResponsesFeed}</div>
          </div>  
        ) : (
          <div >
            <div>{neuPost}</div>
            <div>{loadPosts}</div>
          </div>
        )}
      </div>
      
    );
  
}

export default Post