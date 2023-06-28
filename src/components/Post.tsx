import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { DocumentData,   getDoc, 
  collection, 
  serverTimestamp,
  orderBy, 
  setDoc, 
  doc,
  where,
  query,
  getDocs,
  deleteDoc,
  arrayRemove} from 'firebase/firestore';
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
    newPost: DocumentData[];
    posts: DocumentData[];
    setPosts?: React.Dispatch<React.SetStateAction<DocumentData[]>>;
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
    userMainFeed?: DocumentData[];
    setUserMainFeed: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    refresh?: undefined | boolean;
    setProfPost?: React.Dispatch<React.SetStateAction<boolean>>;
    addToStatesCount?: React.Dispatch<React.SetStateAction<number>>;
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
    setProfPostCheck?: React.Dispatch<React.SetStateAction<number>>;
}

const Post: React.FC<PostProps> = ({ 
  name,
  update, 
  newPost, 
  setNewPost,
  posts, 
  setPosts,
  setUpdate, 
  user, 
  bookmarkPosts, 
  setBookmarkPosts,
  isComment,
  parentPost,
  post,
  profResp,
  repost,
  setRepost,
  userMainFeed,
  setUserMainFeed,
  profPost,
  setProfPost,
  addToStatesCount,
  setLoading,
  setProfPostCheck
  }) => {
  
  const navigate = useNavigate();
  const style = {"fontSize": "large"}

  //Getting single post object values and passing them to the postPage URL
  const RedirectToPostPage = (post: DocumentData) => {
    if(addToStatesCount) addToStatesCount(0);
    if(setLoading) setLoading(true);
    navigate(`/post/${post.postID}`, {state: {post}})
    const postPageContainers = document.querySelectorAll(".post-page-container");
    postPageContainers.forEach((container: Element) => {
    (container.parentElement?.parentElement as HTMLElement).style.visibility = "hidden";
});
    
  }

  const RedirectToProfilePage = (post: DocumentData | undefined) => {
    navigate(`/profile/${post?.username}`, {state: {post}});
    update === true ? setUpdate(false) : setUpdate(true);
    
  }

  const RemovePost = (post: DocumentData | undefined) => {

    setUserMainFeed(prevVal => 
      prevVal.filter(value => value !== post?.postID));

    setNewPost(prevVal => 
      prevVal.filter(value => value.postID !== post?.postID));

    if(setPosts) {
      setPosts(prevVal => 
        prevVal.filter(value => value.postID !== post?.postID));
      }
      console.log(newPost)
      console.log(posts)

    var removePostFromDB = async () =>  {
      const userRef = doc(db, 'users', user.uid);
      await deleteDoc(doc(db, "posts", post?.postID));
      await setDoc(userRef, {mainFeed: arrayRemove(post?.postID)}, {merge: true});
      console.log(posts)
    }
    //update === true ? setUpdate(false) : setUpdate(true);
    removePostFromDB();
    //update === true ? setUpdate(false) : setUpdate(true)
  }

  //Add setUSerMainFeed in the useEffect to reset the userMainFeed
  useEffect(() => {
    
    // if(setProfPost)setProfPost(true)
    getUserMainFeed()
    //setUserMainFeed(prevVal => prevVal.filter(value => value !== post?.postID))
   
    //setTimeout(() => getUserMainFeed(), 250)

    // fetchUserMainFeed()
   }, [repost, update])//all posts rerender when these change
   //If I remove reposted from the dependecies [] the main feed will keep the reposted in place but then

   let getUserMainFeed = async () => {

    if(user && post?.userID) {
      const userDocRef = doc(db, "users", post?.userID);
      const userDocSnap = await getDoc(userDocRef);
      if(userDocSnap.exists()){
        const userDocSnapData = userDocSnap.data();
        console.log(userDocSnapData,"!!!!!!!!!!!")
        setUserMainFeed(userDocSnapData.mainFeed.reverse());
        
      } else {
        console.log("userDocSnap doesnt exist")
      }
    } else {
      console.log("no user")
    }
  }

  //renaming post prop to be used inside posts.map
  let newPostValue = post

  //neuPosts sets the new post directly into the feed, without any server commmunication

    let neuPost = newPost.map(post =>  post.parentID === null ?  
      <div className="post-container" key={post.postID}>
        {user.uid === post?.userID ? <button onClick={() => RemovePost(post)}>x</button> : <></>}
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
         userMainFeed={userMainFeed}
         setUserMainFeed={setUserMainFeed}
         profPost={profPost}
         setProfPost={setProfPost}
         addToStatesCount={addToStatesCount}
         

        />
      </div>
      : <></>
    )
    
    //LoadPosts also sets the posts into the feed, but it does it by getting the information from a sql query done in the previous componenet.
    //The separation between both types of setting posts into the feed is because the loadPosts takes long to render because of the query, 
    //so the neuPost was created to improve the user experience by adding the new post right away.
    let loadPosts = posts.map(post => post.parentID === null ?
      <div className="post-container" key={post.postID}>
        {user.uid === post?.userID ? <button onClick={() => RemovePost(post)}>x</button> : <></>}
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
         userMainFeed={userMainFeed}
         setUserMainFeed={setUserMainFeed}
         profPost={profPost}
         setProfPost={setProfPost}
         addToStatesCount={addToStatesCount}

        />
      </div>
      : <></>
    )
    //Comment sets a "sub-post" inside the commented post, its only visible when the parent post is clicked.
    let comment = posts.map(post =>  post.parentID === parentPost?.postID ?  
      <div className="post-page-container" key={post.postID}>
        {user.uid === post?.userID ? <button onClick={() => RemovePost(post)}>x</button> : <></>}
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
         userMainFeed={userMainFeed}
         setUserMainFeed={setUserMainFeed}
         profPost={profPost}
         setProfPost={setProfPost}
         addToStatesCount={addToStatesCount}

        />
      </div>
      : <></>
    )

    let newComment = newPost.map(post =>  post.parentID === parentPost?.postID ?  
      <div className="post-page-container" key={post.postID}>
        {user.uid === post?.userID ? <button onClick={() => RemovePost(post)}>x</button> : <></>}
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
         userMainFeed={userMainFeed}
         setUserMainFeed={setUserMainFeed}
         profPost={profPost}
         setProfPost={setProfPost}
         addToStatesCount={addToStatesCount}

        />
      </div>
      : <></>
    )
    
    let clickedPost =  
      <div className="post-page-container" key={post?.postID} style={style} >
        {user.uid === post?.userID ? <button onClick={() => RemovePost(post)}>x</button> : <></>}
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
         userMainFeed={userMainFeed}
         setUserMainFeed={setUserMainFeed}
         profPost={profPost}
         setProfPost={setProfPost}
         addToStatesCount={addToStatesCount}

        />
      </div>
//clickedPostParentPost renders the parent post of the clicked post (if it has a parentID)

let clickedPostParentPost =   posts.map(post =>  
  post.postID === newPostValue?.parentID ?  
  <div className="post-page-container" key={post.postID} style={style}>
    {user.uid === post?.userID ? <button onClick={() => RemovePost(post)}>x</button> : <></>}
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
      userMainFeed={userMainFeed}
      setUserMainFeed={setUserMainFeed}
      profPost={profPost}
      setProfPost={setProfPost}
      addToStatesCount={addToStatesCount}
    />
  </div>
  : <></>
)
let rootPost =  posts.map(post =>  
  post.postID === newPostValue?.rootPostID &&
  newPostValue?.parentID !== post.postID && 
  newPostValue?.parentID !== null ?  
  <div className="post-page-container" key={post.postID} style={style}>
    {user.uid === post?.userID ? <button onClick={() => RemovePost(post)}>x</button> : <></>}
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
      userMainFeed={userMainFeed}
      setUserMainFeed={setUserMainFeed}
      profPost={profPost}
      setProfPost={setProfPost}
      addToStatesCount={addToStatesCount}

    />
  </div>
  : <></>
)
console.log(userMainFeed)
// let filteredPosts = posts.filter()

//Loads the profile main feed(posts and reposts), the order of the userMainFeed array was inverted
//and the posts.map was nested inside it so that it obeys the sequence of the userMainFeed array.
let profilePostsFeed =  userMainFeed?.map(val => posts.map(post => 
  val === post.postID ?
  <div className="post-container" key={post.postID} style={style}>
    {user.uid === post?.userID ? <button onClick={() => RemovePost(post)}>x</button> : <></>}
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
      userMainFeed={userMainFeed}
      setUserMainFeed={setUserMainFeed}
      profPost={profPost}
      setProfPost={setProfPost}
      addToStatesCount={addToStatesCount}
      
    /> 
  </div>
  : <></>
))

let profileNewPostsFeed =  newPost.map(post =>  
  post.userID === newPostValue?.userID &&
  post.parentID === null ?  
  <div className="post-container" key={post.postID} style={style}>
    {user.uid === post?.userID ? <button onClick={() => RemovePost(post)}>x</button> : <></>}
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
      userMainFeed={userMainFeed}
      setUserMainFeed={setUserMainFeed}
      profPost={profPost}
      setProfPost={setProfPost}
      addToStatesCount={addToStatesCount}
      
    />
  </div>
  : <></>
)

let profileResponsesFeed =  posts.map(post =>  
  post.userID === newPostValue?.userID &&
  post.parentID !== null ?  
  <div className="post-container" key={post.postID} style={style}>
    {user.uid === post?.userID ? <button onClick={() => RemovePost(post)}>x</button> : <></>}
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
      userMainFeed={userMainFeed}
      setUserMainFeed={setUserMainFeed}
      profPost={profPost}
      setProfPost={setProfPost}
      addToStatesCount={addToStatesCount}
      setProfPostCheck={setProfPostCheck}
    />
  </div>
  : <></>
)
let profileNewResponsesFeed =  newPost.map(post =>  
  post.userID === newPostValue?.userID &&
  post.parentID !== null ?  
  <div className="post-container" key={post.postID} style={style}>
    {user.uid === post?.userID ? <button onClick={() => RemovePost(post)}>x</button> : <></>}
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
      userMainFeed={userMainFeed}
      setUserMainFeed={setUserMainFeed}
      profPost={profPost}
      setProfPost={setProfPost}
      addToStatesCount={addToStatesCount}
    />
  </div>
  : <></>
)

let repostsFromUser = posts.map(post =>  
  
    //user.reposts?.find(repost => repost === post.postID) 
    post.repostByUsers.includes(newPostValue?.userID) ?
    <div className="post-container" key={post.postID} style={style}>
      {user.uid === post?.userID ? <button onClick={() => RemovePost(post)}>x</button> : <></>}
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
        userMainFeed={userMainFeed}
        setUserMainFeed={setUserMainFeed}
        profPost={profPost}
        setProfPost={setProfPost}
        addToStatesCount={addToStatesCount}
      
      />
    </div>
    : <></>
  )

  let newRepostsFromUser = posts.map(post => 
    //repost?.find(repost => repost.postID === post.postID) ?
    repost?.includes(post) ?
    <div className="post-container" key={post.postID} style={style}>
      {user.uid === post?.userID ? <button onClick={() => RemovePost(post)}>x</button> : <></>}
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
        userMainFeed={userMainFeed}
        setUserMainFeed={setUserMainFeed}
        profPost={profPost}
        setProfPost={setProfPost}
        addToStatesCount={addToStatesCount}
      />
    </div>
    : <></>
  )
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
            {/* <div>{newRepostsFromUser}</div> */}
            <div>{profileNewPostsFeed}</div>
            {/* <div>{repostsFromUser}</div> */}
            <div>{profilePostsFeed}</div>
          </div>
        ) : profPost === false ? (
          <div>
            <div>{profileNewResponsesFeed}</div>
            <div>{profileResponsesFeed}</div>
          </div>  
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