import React, { useEffect, useState, MouseEvent, useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
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
  arrayRemove,
  arrayUnion} from 'firebase/firestore';
import { FiArrowLeft } from 'react-icons/fi'
import { db } from "../firebase";
import Like from './Like'
import BookmarkBtn from './BookmarkBtn';
import PostPage from './PostPage';
import FollowBtn from './FollowBtn';
import Comment from './Comment';
import Repost from './Repost';
import myImg from '../img/user-icon.png';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';


type UserProps = {
  authProvider?: string;
  email: string;
  name?: string;
  uid: string;
  bookmarks?: Array<string>;
  reposts?: Array<string>;
  imgUrl?: string
}  

type PostProps = {
    name: string;
    setNewPost: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    newPost: DocumentData[];
    posts: DocumentData[];
    postsRenew?: DocumentData[];
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
    bookmarkUpdate?: undefined | boolean;
    favorited?: boolean;
    setFavorited?: React.Dispatch<React.SetStateAction<boolean>>;
    search?: string;
    updateFollow?: boolean;
    setUpdateFollow?:React.Dispatch<React.SetStateAction<boolean>>;
    setPostFeedStatesCount?: React.Dispatch<React.SetStateAction<number>>;
    handleFollow?:() => void;
    setProfileStatesCount?: React.Dispatch<React.SetStateAction<number>>
    userData?: DocumentData;
    userImg?: string;
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
  setProfPostCheck,
  bookmarkUpdate,
  search,
  updateFollow,
  setUpdateFollow,
  handleFollow,
  setPostFeedStatesCount,
  setProfileStatesCount,
  postsRenew,
  userData,
  userImg
  }) => {
    console.log(post,"pos111t12")
    
  // const [followBtn, setFollowBtn] = React.useState<boolean>(false);
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();
  const storage = getStorage();
  const [profileImg, setProfileImg] = useState("")
  const style = {"fontSize": "large"}
  //const [postsArray, setPostArray] = useState(posts.length === 0 ? postsRenew : posts)
  const postsArray = posts.length === 0 ? postsRenew : posts
  console.log(postsArray, "posts assssssssrrsay")
  //const newPostsArray = newPost.length === 0 ? postsRenew : postsRenew;
  
//   const fetchPosts = async() => {    
//     console.log("KAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWWWWWWWWWWWWWww")
//     const postDocRef = doc(db, "posts");
//     const postDocSnap = await getDoc(postDocRef);
//     const postDocSnapData = postDocSnap.data();
//     console.log(postDocSnapData, "SNAP")
//     if(setPosts) {
//       setPosts((postDocSnapData as DocumentData[]).map(val => {
//         console.log("VALAAAAA", val)
//         return val;
//       }));
//     }
// };

// const fetchPosts = async() => {    
//   const postDocSnapData = await getDocs(query(collection(db, "posts"), orderBy("timestamp", "desc")));
//   console.log(postDocSnapData, "SNAP")
//   if(setPosts) {
//     postDocSnapData.forEach(doc => {
//       setPosts(prevValue => [...prevValue, doc.data()])
//     })
//   }
// };
console.log(postsRenew,"posts#!@ #heres1")
console.log(profPost,"posts#!@ PrSoPost")
console.log(postsArray,"postss#!@@@ ")
   //Getting profile image from storage
  //  let storageRef = ref(storage, `images/${userCtx?.uid}/profile_image/profile_img.png`)
  //  getDownloadURL(storageRef)
  //  .then((url) => {
  //     const img = document.getElementById('myimg');
  //     img?.setAttribute('src', url)
  //  })

  console.log(userCtx, "USER POST !")

  //Getting single post object values and passing them to the postPage URL
  const RedirectToPostPage = (post: DocumentData) => {
    //if(addToStatesCount) addToStatesCount(0);
    if(setPostFeedStatesCount) setPostFeedStatesCount(0);
    navigate(`/post/${post.postID}`, {state: {post}})
    const postPageContainers = document.querySelectorAll(".post-page-container");
    postPageContainers.forEach((container: Element) => {
    (container.parentElement?.parentElement as HTMLElement).style.visibility = "hidden";
    });
    if(setLoading) setTimeout(() => setLoading(true),400)
  }

  const RedirectToProfilePage = (post: DocumentData | undefined) => {
    // if(profPost) {
    //   const profileContainer = 
    //             document.querySelector(".user-container-profile-page-container") as HTMLElement;
    //             profileContainer.style.visibility = "hidden" }     
    navigate(`/profile/${post?.username}`, {state: {post}});
    setUpdate(!update)
  }

  const RemovePost = (post: DocumentData | undefined) => {
    
    if(!profPost) { 
      //setPostArray(postsArray?.filter(val => val !== post?.postID))
      postsArray?.filter(val => val !== post?.postID)
      setUpdate(!update);
    }
    setUserMainFeed(prevVal => 
      prevVal.filter(value => value !== post?.postID));

    setNewPost(prevVal => 
      prevVal.filter(value => value.postID !== post?.postID));

    if(setPosts) {
      setPosts(prevVal => 
        prevVal.filter(value => value.postID !== post?.postID));
      }

    var removePostFromDB = async () =>  {
      if(userCtx){
        const userRef = doc(db, 'users', userCtx.uid);
        await deleteDoc(doc(db, "posts", post?.postID));
        await setDoc(userRef, {mainFeed: arrayRemove(post?.postID)}, {merge: true});
      }
 
    }
    removePostFromDB();
    //update === true ? setUpdate(false) : setUpdate(true)
  }

  //Add setUSerMainFeed in the useEffect to reset the userMainFeed
  useEffect(() => {
    //if(userCtx === null) navigate("/");
    //getUserMainFeed();
    //fetchPosts();
   }, [repost, update])//all posts rerender when these change

   //If I remove reposted from the dependecies [] the main feed will keep the reposted in place but then
  //  let getUserMainFeed = async () => {
    
  //   if(userData) {
  //     const userDocRef = doc(db, "users", userData.uid);
  //     const userDocSnap = await getDoc(userDocRef);
  //     if(userDocSnap.exists()){
  //       const userDocSnapData = userDocSnap.data();
  //       setUserMainFeed(userDocSnapData.mainFeed.reverse());
        
  //     } else {
  //       console.log("userDocSnap doesnt exist")
  //     }
  //   } else {
  //     console.log("no user")
  //   }
  // }
  console.log(userData, "user Data")
  console.log(userMainFeed, 'user Data feed')

  const handleClick = (event: MouseEvent) => {
    let targetElement = event.target as HTMLElement;
    targetElement = targetElement.parentElement as HTMLElement;
    
    const nextElement = targetElement.nextElementSibling as HTMLElement;
    const nextNextEle = nextElement.children[0] as HTMLElement;
    if(event.target && nextElement.style.display === "none") {
      nextElement.style.display = "flex";
      nextNextEle.style.display = "flex";
    } else {
      nextElement.style.display = "none";
      nextElement.style.display = "none";
    }
  };

  //Event to set display=none for all option elements(follow/unfollow and delete post) when these are not the current element being interacted with.
  document.addEventListener("click", function(event) {
    let targetElement = event.target as HTMLElement;
    let allOptions = document.querySelectorAll("#options");
    let optionsBtn = targetElement.closest(".options-btn");
    let options = targetElement.closest("#options");
    let allOptionsBtn = document.querySelectorAll(".options-btn");
    let arraAllOptions = Array.from(allOptions)
    let arraAllOptionsBtn = Array.from(allOptionsBtn)
    
    arraAllOptionsBtn.forEach(optionBtn => {
      if(optionsBtn) {
        if (arraAllOptionsBtn.indexOf(optionsBtn) !== arraAllOptionsBtn.indexOf(optionBtn)) {
          (optionBtn.nextElementSibling as HTMLElement).style.display = "none";
          }
      } else if(!options && !optionsBtn) {
        (optionBtn.nextElementSibling as HTMLElement).style.display = "none";
      }
    })

    allOptions.forEach(optionsEle => {
      if(options) {
        if (arraAllOptions.indexOf(options) !== arraAllOptions.indexOf(optionsEle)) {
          (optionsEle as HTMLElement).style.display = "none";
          }
      } else if(!options && !optionsBtn) {
        (optionsEle as HTMLElement).style.display = "none";
      }
    });
  });

  //Getting the height of the post element dynamically to create the connection line between posts and its reponses.
  const userContainer = document.querySelector(".user-container")
  if(userContainer) {
    const userContainerStyle = window.getComputedStyle(userContainer)
    const userContainerHeight = userContainerStyle.getPropertyValue('height');
    const connectingLine = document.querySelector(".connecting-comments-line") as HTMLElement;
    if(connectingLine) {
      connectingLine.style.height = userContainerHeight 
      }
  }

  const userContainer2 = document.querySelector(".user-container2")
  if(userContainer2) {
    const userContainerStyle = window.getComputedStyle(userContainer2)
    const userContainerHeight = userContainerStyle.getPropertyValue('height');
    const connectingLine = document.querySelector(".connecting-comments-line2") as HTMLElement;
    if(connectingLine) {
      connectingLine.style.height = userContainerHeight 
      }
  }

  const dotsSvg = <svg viewBox="0 0 24 24" className="threeDotsSvg" aria-hidden="true"><g><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></g></svg>
  
//   document.querySelectorAll(".profile-picture").forEach(val => {

//     val.setAttribute('src', (val as HTMLImageElement).src+"&");
// })
  //renaming post prop to be used inside posts.map
  let newPostValue = post

  //neuPost sets the new post directly into the feed, without any server commmunication
    let neuPost = newPost.map(post =>  post.parentID === null ?  
      <div className="post-container" key={post.postID}>
        <div className="option-btn-container">
          <button className="options-btn"  onClick={(e) => handleClick(e)}>{dotsSvg}</button>
          <div style={{display: "none"}} className="btnSubcontainer">
            <div id="options" style={{display: "flex"}}>
            {
              userCtx?.uid === post?.userID ?
              <button className="deleteBtn" onClick={() => RemovePost(post)}>Delete</button> :
              <div><FollowBtn post={post} user={userCtx as UserProps} setUpdateFollow={setUpdateFollow} updateFollow={updateFollow} /></div>
            }
            </div>
          </div>
        </div>
        <div className="user-container">
          <img className="profile-picture" alt="user icon" src={post?.imgUrl}></img>
          <span>
            <div className="user-name-post" onClick={() => RedirectToProfilePage(post)}>
              {post.username}
            </div>
          <div className="content" onClick={() => RedirectToPostPage(post)}>
            <li key={post.id} className="text-content-field">
              {post.textContent}
            </li>
          </div>
          </span>   
        </div>
      <div className="main-btn-container">
        <div className="btn-container"> 
        <Like 
        user={userCtx as UserProps} 
        post={post}
        /> 
        <BookmarkBtn 
          user={userCtx as UserProps} 
          post={post} 
          update={update} 
          setUpdate={setUpdate}
          bookmarkPosts={bookmarkPosts} 
          setBookmarkPosts={setBookmarkPosts}
          userData={userData}
        />
        <Comment 
         user={userCtx as UserProps}
         post={post}
         setUpdate={setUpdate}
         setNewPost={setNewPost}
         newPost={newPost}
         update={update}
         name={name}
         userData={userData}
         userImg={userImg}
        />
        <Repost 
        user={userCtx as UserProps}
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
        setPostFeedStatesCount={setPostFeedStatesCount}
        />
        </div>
        </div>
      </div>
      : <></>
    )
    
    //LoadPosts also sets the posts into the feed, but it does it by getting the information from a sql query done in the previous component.
    //The separation between both types of setting posts into the feed is because the loadPosts takes long to render because of the query, 
    //so the neuPost was created to improve the user experience by adding the new post right away.
    let loadPosts = postsArray?.map(post => { 
      if(post.parentID === null) {
        
        return <div className="post-container" key={post.postID}>
        <div className="option-btn-container">
          <button className="options-btn"  onClick={(e) => handleClick(e) }>{dotsSvg}</button>
          <div style={{display: "none"}} className="btnSubcontainer">
            <div id="options" style={{display: "flex"}}>
            {
              userCtx?.uid === post?.userID ?
              <button className="deleteBtn" onClick={() => RemovePost(post)}>Delete</button> :
              <div><FollowBtn post={post} user={userCtx as UserProps} setUpdateFollow={setUpdateFollow} updateFollow={updateFollow} /></div>
            }
            </div>
          </div>
        </div>
        <div className="user-container">
          <img className="profile-picture" alt="user icon" src={post?.imgUrl}></img>
          
          <span>
            <div className="user-name-post" onClick={() => RedirectToProfilePage(post)}>
              {post.username}
            </div>
          <div className="content" onClick={() => RedirectToPostPage(post)}>
            <li key={post.id} className="text-content-field">
              {post.textContent}
            </li>
          </div>
          </span>
        </div>
            <div className="main-btn-container">
      <div className="btn-container"> 
        <Like 
        user={userCtx as UserProps} 
        post={post}
        /> 
        <BookmarkBtn 
          user={userCtx as UserProps} 
          post={post} 
          update={update} 
          setUpdate={setUpdate}
          bookmarkPosts={bookmarkPosts} 
          setBookmarkPosts={setBookmarkPosts}
          userData={userData}
        />
        <Comment
        user={userCtx as UserProps}
        post={post}
        setUpdate={setUpdate}
        setNewPost={setNewPost}
        newPost={newPost}
        update={update}
        name={name}
        userData={userData}
        userImg={userImg}
        />
        <Repost 
        user={userCtx as UserProps}
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
        setPostFeedStatesCount={setPostFeedStatesCount}
        
       />
      </div>
      </div>
      </div>
      } else {
        return <></>
        
      }
  })
  
  let loadSearch = postsArray?.map(post => { 
    if(post.textContent.includes(search)) {
      return <div className="post-container" key={post.postID}>
      <div className="option-btn-container">
        <button className="options-btn"  onClick={(e) => handleClick(e) }>{dotsSvg}</button>
        <div style={{display: "none"}} className="btnSubcontainer">
            <div id="options" style={{display: "flex"}}>
            {
              userCtx?.uid === post?.userID ?
              <button className="deleteBtn" onClick={() => RemovePost(post)}>Delete</button> :
              <div><FollowBtn post={post} user={userCtx as UserProps} setUpdateFollow={setUpdateFollow} updateFollow={updateFollow} /></div>
            }
            </div>
        </div>
      </div>
      <div className="user-container">
        <img className="profile-picture" alt="user icon" src={post?.imgUrl}></img>
        <span>
          <div className="user-name-post" onClick={() => RedirectToProfilePage(post)}>
            {post.username}
          </div>
        <div className="content" onClick={() => RedirectToPostPage(post)}>
          <li key={post.id} className="text-content-field">
            {post.textContent}
          </li>
        </div>
        </span>
      </div>
      <div className="main-btn-container">
      <div className="btn-container"> 
      <Like 
      user={userCtx as UserProps} 
      post={post}
      /> 
      <BookmarkBtn 
        user={userCtx as UserProps} 
        post={post} 
        update={update} 
        setUpdate={setUpdate}
        bookmarkPosts={bookmarkPosts} 
        setBookmarkPosts={setBookmarkPosts}
        userData={userData}
      />
      <Comment
      user={userCtx as UserProps}
      post={post}
      setUpdate={setUpdate}
      setNewPost={setNewPost}
      newPost={newPost}
      update={update}
      name={name}
      userData={userData}
      userImg={userImg}
      />
     <Repost 
       user={userCtx as UserProps}
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
       setPostFeedStatesCount={setPostFeedStatesCount}
      />
    </div>
    </div>
    </div>
    } else {
      return <></>
      
    }
})   

    // Comment sets a "sub-post" inside the commented post, its only visible when the parent post is clicked.
    let comment = postsArray?.map(post =>  post.parentID === parentPost?.postID ?  
      <div className="post-page-container" key={post.postID}>
        <div className="option-btn-container">
         <button className="options-btn"  onClick={(e) => handleClick(e)}>{dotsSvg}</button>
         <div style={{display: "none"}} className="btnSubcontainer">
            <div id="options" style={{display: "flex"}}>
            {
              userCtx?.uid === post?.userID ?
              <button className="deleteBtn" onClick={() => RemovePost(post)}>Delete?</button> :
              <div><FollowBtn post={post} user={userCtx as UserProps} setUpdateFollow={setUpdateFollow} updateFollow={updateFollow} /></div>
            }
            </div>
        </div>
        </div>
        <div className="user-container">
          <img className="profile-picture" alt="user icon" src={post?.imgUrl}></img>
          <span>
            <div className="user-name-post" onClick={() => RedirectToProfilePage(post)}>
              {post.username}
            </div>
          <div className="content" onClick={() => RedirectToPostPage(post)}>
            <li key={post.id} className="text-content-field">
              {post.textContent}
            </li>
          </div>
          </span>   
        </div>
      <div className="main-btn-container">
      <div className="btn-container"> 
        <Like 
        user={userCtx as UserProps} 
        post={post}
        /> 
        <BookmarkBtn 
          user={userCtx as UserProps} 
          post={post} 
          update={update} 
          setUpdate={setUpdate}
          bookmarkPosts={bookmarkPosts} 
          setBookmarkPosts={setBookmarkPosts}
          userData={userData}
        />
        <Comment 
         user={userCtx as UserProps}
         post={post}
         setUpdate={setUpdate}
         setNewPost={setNewPost}
         newPost={newPost}
         update={update}
         name={name}
         userData={userData}
         userImg={userImg}
        />
        <Repost 
         user={userCtx as UserProps}
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
         setPostFeedStatesCount={setPostFeedStatesCount}
         />
      </div>
      </div>
      </div>
      : <></>
    )

    let newComment = postsArray?.map(post =>  post.parentID === parentPost?.postID ?  
      <div className="post-page-container" key={post.postID}>
        <div className="option-btn-container">
          <button className="options-btn"  onClick={(e) => handleClick(e)}>{dotsSvg}</button>
          <div style={{display: "none"}} className="btnSubcontainer">
            <div id="options" style={{display: "flex"}}>
            {
              userCtx?.uid === post?.userID ?
              <button className="deleteBtn" onClick={() => RemovePost(post)}>Delete</button> :
              <div><FollowBtn post={post} user={userCtx as UserProps} setUpdateFollow={setUpdateFollow} updateFollow={updateFollow} /></div>
            }
          </div>
        </div>
        </div>
        <div className="user-container">
          <img className="profile-picture" alt="user icon" src={post?.imgUrl}></img>
          <span>
            <div className="user-name-post" onClick={() => RedirectToProfilePage(post)}>
              {post.username}
            </div>
          <div className="content" onClick={() => RedirectToPostPage(post)}>
            <li key={post.id} className="text-content-field">
              {post.textContent}
            </li>
          </div>
          </span>   
        </div>
      <div className="main-btn-container">
      <div className="btn-container"> 
        <Like 
        user={userCtx as UserProps} 
        post={post}
        /> 
        <BookmarkBtn 
         user={userCtx as UserProps} 
         post={post} 
         update={update} 
         setUpdate={setUpdate}
         bookmarkPosts={bookmarkPosts} 
         setBookmarkPosts={setBookmarkPosts}
         userData={userData}
        />
        <Comment 
         user={userCtx as UserProps}
         post={post}
         setUpdate={setUpdate}
         setNewPost={setNewPost}
         newPost={newPost}
         update={update}
         name={name}
         userData={userData}
         userImg={userImg}
        />
        <Repost 
         user={userCtx as UserProps}
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
         setPostFeedStatesCount={setPostFeedStatesCount}
         />
        </div>
        </div>
      </div>
      : <></>
    )
    
    let clickedPost =  
    <div className="post-page-container" key={post?.postID} style={style}>
        <div className="option-btn-container">
          <button className="options-btn"  onClick={(e) => handleClick(e)}>{dotsSvg}</button>
          <div style={{display: "none"}} className="btnSubcontainer">
          <div style={{display: "none"}} className="btnSubcontainer">
            <div id="options" style={{display: "flex"}}>
            {
              userCtx?.uid === post?.userID ?
              <button className="deleteBtn" onClick={() => RemovePost(post)}>Delete</button> :
              <div><FollowBtn post={post} user={userCtx as UserProps} setUpdateFollow={setUpdateFollow} updateFollow={updateFollow} /></div>
            }
          </div>
        </div>
        </div>
        </div>
        <div className="user-container">
          <img className="profile-picture" alt="user icon" src={post?.imgUrl}></img>
          <span>
            <div className="user-name-post" onClick={() => RedirectToProfilePage(post)}>
              {post?.username}
            </div>
          <div className="content" >
            <li key={post?.id} className="text-content-field">
              {post?.textContent}
            </li>
          </div>
          </span>   
        </div>
      <div className="main-btn-container">
      <div className="btn-container"> 
        <Like 
        user={userCtx as UserProps} 
        post={post}
        /> 
        <BookmarkBtn 
          user={userCtx as UserProps} 
          post={post} 
          update={update} 
          setUpdate={setUpdate}
          bookmarkPosts={bookmarkPosts} 
          setBookmarkPosts={setBookmarkPosts}
          userData={userData}
        />
        <Comment 
         user={userCtx as UserProps}
         post={post}
         setUpdate={setUpdate}
         setNewPost={setNewPost}
         newPost={newPost}
         update={update}
         name={name}
         userData={userData}
         userImg={userImg}
        />
        <Repost 
    user={userCtx as UserProps}
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
    setPostFeedStatesCount={setPostFeedStatesCount}
    
   />
      </div> 
      </div> 
      </div>

//clickedPostParentPost renders the parent post of the clicked post (if it has a parentID)
let clickedPostParentPost =   postsArray?.map(post =>  
  post.postID === newPostValue?.parentID ?  
  <div className="post-page-container" key={post.postID} style={style}>
        <div className="option-btn-container">
          <button className="options-btn"  onClick={(e) => handleClick(e)}>{dotsSvg}</button>
          <div style={{display: "none"}} className="btnSubcontainer">
            <div id="options" style={{display: "flex"}}>
            {
              userCtx?.uid === post?.userID ?
              <button className="deleteBtn" onClick={() => RemovePost(post)}>Delete</button> :
              <div><FollowBtn post={post} user={userCtx as UserProps} setUpdateFollow={setUpdateFollow} updateFollow={updateFollow} /></div>
            }
          </div>
        </div>
        </div>
    <div className="user-container2">
      <div className="profile-line-connector">
      <img className="profile-picture" alt="user icon" src={post?.imgUrl}></img>
      <span className="connecting-comments-line2"></span>
      </div>
      <span>
        <div className="user-name-post" onClick={() => RedirectToProfilePage(post)}>
          {post.username}
        </div>
      <div className="content" onClick={() => RedirectToPostPage(post)}>
        <li key={post.id} className="text-content-field">
          {post.textContent}
        </li>
      </div>
      </span>   
    </div>
    <div className="main-btn-container">
    <div className="btn-container"> 
    <Like 
    user={userCtx as UserProps} 
    post={post}
    /> 
    <BookmarkBtn 
    user={userCtx as UserProps} 
    post={post} 
    update={update} 
    setUpdate={setUpdate}
    bookmarkPosts={bookmarkPosts} 
    setBookmarkPosts={setBookmarkPosts}
    userData={userData}
    />
    <Comment 
     user={userCtx as UserProps}
     post={post}
     setUpdate={setUpdate}
     setNewPost={setNewPost}
     newPost={newPost}
     update={update}
     name={name}
     userData={userData}
     userImg={userImg}
    />
    <Repost 
    user={userCtx as UserProps}
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
    setPostFeedStatesCount={setPostFeedStatesCount}
    
   />
  </div>  
  </div>
  </div>
  : <></>
)
let rootPost =  postsArray?.map(post =>  
  post.postID === newPostValue?.rootPostID &&
  newPostValue?.parentID !== post.postID && 
  newPostValue?.parentID !== null ?  
  <div className="post-page-container" key={post.postID} style={style}>
        <div className="option-btn-container">
          <button className="options-btn"  onClick={(e) => handleClick(e)}>{dotsSvg}</button>
          <div style={{display: "none"}} className="btnSubcontainer">
            <div id="options" style={{display: "flex"}}>
            {
              userCtx?.uid === post?.userID ?
              <button className="deleteBtn" onClick={() => RemovePost(post)}>Delete!</button> :
              <div><FollowBtn post={post} user={userCtx as UserProps} setUpdateFollow={setUpdateFollow} updateFollow={updateFollow} /></div>
            }
          </div>
        </div>
        </div>
    <div className="user-container">
      <div className="profile-line-connector">
      <img className="profile-picture" alt="user icon" src={post?.imgUrl}></img>
      <span className="connecting-comments-line"></span>
      </div>
      <span>
        <div className="user-name-post" onClick={() => RedirectToProfilePage(post)}>
          {post.username}
        </div>
      <div className="content" onClick={() => RedirectToPostPage(post)}>
        <li key={post.id} className="text-content-field">
          {post.textContent}
        </li>
      </div>
      </span>   
    </div>
    <div className="main-btn-container">
    <div className="btn-container"> 
    <Like 
    user={userCtx as UserProps} 
    post={post}
    /> 
    <BookmarkBtn 
    user={userCtx as UserProps} 
    post={post} 
    update={update} 
    setUpdate={setUpdate}
    bookmarkPosts={bookmarkPosts} 
    setBookmarkPosts={setBookmarkPosts}
    userData={userData}
    />
    <Comment 
     user={userCtx as UserProps}
     post={post}
     setUpdate={setUpdate}
     setNewPost={setNewPost}
     newPost={newPost}
     update={update}
     name={name}
     userData={userData}
     userImg={userImg}
    />
    <Repost 
    user={userCtx as UserProps}
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
    setPostFeedStatesCount={setPostFeedStatesCount}
   />
  </div>  
  </div>  
  </div>
  : <></>
)
console.log(userMainFeed,"OPOP")
console.log(postsArray,"OPOP")
// let filteredPosts = posts.filter()

//Loads the profile main feed(posts and reposts), the order of the userMainFeed array was inverted
//and the posts.map was nested inside it so that it obeys the sequence of the userMainFeed array.
let profilePostsFeed =  userMainFeed?.map(val => postsArray?.map(post => 
  val === post.postID ?
  <div className="post-container" key={post.postID} style={style}>
        <div className="option-btn-container">
          <button className="options-btn"  onClick={(e) => handleClick(e)}>{dotsSvg}</button>
          <div style={{display: "none"}} className="btnSubcontainer">
            <div id="options" style={{display: "flex"}}>
            {
              userCtx?.uid === post?.userID ?
              <button className="deleteBtn" onClick={() => RemovePost(post)}>Delete</button> :
              <div><FollowBtn post={post} user={userCtx as UserProps} setUpdateFollow={setUpdateFollow} updateFollow={updateFollow} /></div>
            }
          </div>
        </div>
        </div>
    <div className="user-container">
      <img className="profile-picture-profile-feed" alt="user icon" src={post?.imgUrl}></img>
      <span>
        <div className="user-name-post" onClick={() => RedirectToProfilePage(post)}>
          {post.username}
        </div>
      <div className="content" onClick={() => RedirectToPostPage(post)}>
        <li key={post.id} className="text-content-field">
          {post.textContent}
        </li>
      </div>
      </span>   
    </div>
    <div className="main-btn-container">
    <div className="btn-container"> 
    <Like 
    user={userCtx as UserProps} 
    post={post}
    /> 
    <BookmarkBtn 
    user={userCtx as UserProps} 
    post={post} 
    update={update} 
    setUpdate={setUpdate}
    bookmarkPosts={bookmarkPosts} 
    setBookmarkPosts={setBookmarkPosts}
    userData={userData}
    />
    <Comment 
     user={userCtx as UserProps}
     post={post}
     setUpdate={setUpdate}
     setNewPost={setNewPost}
     newPost={newPost}
     update={update}
     name={name}
     userData={userData}
     userImg={userImg}
    />
   <Repost 
    user={userCtx as UserProps}
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
    setPostFeedStatesCount={setPostFeedStatesCount}
    setProfPostCheck={setProfPostCheck}
   />
  </div>  
  </div>  
  </div>
  : <></>
))

let profileNewPostsFeed =  newPost.map(post =>  
  post.userID === newPostValue?.userID &&
  post.parentID === null ?  
  <div className="post-container" key={post.postID} style={style}>
        <div className="option-btn-container">
          <button className="options-btn"  onClick={(e) => handleClick(e)}>{dotsSvg}</button>
          <div style={{display: "none"}} className="btnSubcontainer">
            <div id="options" style={{display: "flex"}}>
            {
              userCtx?.uid === post?.userID ?
              <button className="deleteBtn" onClick={() => RemovePost(post)}>Delete</button> :
              <div><FollowBtn post={post} user={userCtx as UserProps} setUpdateFollow={setUpdateFollow} updateFollow={updateFollow} /></div>
            }
          </div>
        </div>
        </div>
    <div className="user-container">
      <img className="profile-picture" alt="user icon" src={post?.imgUrl}></img>
      <span>
        <div className="user-name-post" onClick={() => RedirectToProfilePage(post)}>
          {post.username}
        </div>
      <div className="content" onClick={() => RedirectToPostPage(post)}>
        <li key={post.id} className="text-content-field">
          {post.textContent}
        </li>
      </div>
      </span>   
    </div>
    <div className="main-btn-container">
    <div className="btn-container"> 
    <Like 
    user={userCtx as UserProps} 
    post={post}
    /> 
    <BookmarkBtn 
    user={userCtx as UserProps} 
    post={post} 
    update={update} 
    setUpdate={setUpdate}
    bookmarkPosts={bookmarkPosts} 
    setBookmarkPosts={setBookmarkPosts}
    userData={userData}
    />
    <Comment 
     user={userCtx as UserProps}
     post={post}
     setUpdate={setUpdate}
     setNewPost={setNewPost}
     newPost={newPost}
     update={update}
     name={name}
     userData={userData}
     userImg={userImg}
    />
  <Repost 
    user={userCtx as UserProps}
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
    setPostFeedStatesCount={setPostFeedStatesCount}
    
   />
  </div>  
  </div>  
  </div>
  : <></>
)

let profileResponsesFeed =  userMainFeed?.map(val => postsArray?.map(post =>  
  post.postID === val &&
  post.parentID !== null ?  
  <div className="post-container" key={post.postID} style={style}>
        <div className="option-btn-container">
          <button className="options-btn"  onClick={(e) => handleClick(e)}>{dotsSvg}</button>
          <div style={{display: "none"}} className="btnSubcontainer">
            <div id="options" style={{display: "flex"}}>
            {
              userCtx?.uid === post?.userID ?
              <button className="deleteBtn" onClick={() => RemovePost(post)}>Delete</button> :
              <div><FollowBtn post={post} user={userCtx as UserProps} setUpdateFollow={setUpdateFollow} updateFollow={updateFollow} /></div>
            }
          </div>
        </div>
        </div>
    <div className="user-container">
      <img className="profile-picture" alt="user icon" src={post?.imgUrl}></img>
      <span>
        <div className="user-name-post" onClick={() => RedirectToProfilePage(post)}>
          {post.username}
        </div>
      <div className="content" onClick={() => RedirectToPostPage(post)}>
        <li key={post.id} className="text-content-field">
          {post.textContent}
        </li>
      </div>
      </span>   
    </div>
    <div className="main-btn-container">
    <div className="btn-container"> 
    <Like 
    user={userCtx as UserProps} 
    post={post}
    /> 
    <BookmarkBtn 
    user={userCtx as UserProps} 
    post={post} 
    update={update} 
    setUpdate={setUpdate}
    bookmarkPosts={bookmarkPosts} 
    setBookmarkPosts={setBookmarkPosts}
    userData={userData}
    />
    <Comment 
     user={userCtx as UserProps}
     post={post}
     setUpdate={setUpdate}
     setNewPost={setNewPost}
     newPost={newPost}
     update={update}
     name={name}
     userData={userData}
     userImg={userImg}
    />
   <Repost 
    user={userCtx as UserProps}
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
    setPostFeedStatesCount={setPostFeedStatesCount}
    
   />
  </div>
  </div>
  </div>
  : <></>
))
let profileNewResponsesFeed = postsRenew?.map(post =>  
  post.userID === newPostValue?.userID &&
  post.parentID !== null ?  
  <div className="post-container" key={post.postID} style={style}>
        <div className="option-btn-container">
          <button className="options-btn"  onClick={(e) => handleClick(e)}>{dotsSvg}</button>
          <div style={{display: "none"}} className="btnSubcontainer">
            <div id="options" style={{display: "flex"}}>
            {
              userCtx?.uid === post?.userID ?
              <button className="deleteBtn" onClick={() => RemovePost(post)}>Delete</button> :
              <div>
                <FollowBtn post={post} user={userCtx as UserProps} setUpdateFollow={setUpdateFollow} updateFollow={updateFollow}/>
              </div>
            }
          </div>
        </div>
        </div>
    <div className="user-container">
      <img className="profile-picture" alt="user icon" src={post?.imgUrl}></img>
      <span>
        <div className="user-name-post" onClick={() => RedirectToProfilePage(post)}>
          {post.username}
        </div>
      <div className="content" onClick={() => RedirectToPostPage(post)}>
        <li key={post.id} className="text-content-field">
          {post.textContent}
        </li>
      </div>
      </span>   
    </div>
    <div className="main-btn-container">
    <div className="btn-container"> 
    <Like 
    user={userCtx as UserProps} 
    post={post}
    /> 
    <BookmarkBtn 
    user={userCtx as UserProps} 
    post={post} 
    update={update} 
    setUpdate={setUpdate}
    bookmarkPosts={bookmarkPosts} 
    setBookmarkPosts={setBookmarkPosts}
    userData={userData}
    />
    <Comment 
     user={userCtx as UserProps}
     post={post}
     setUpdate={setUpdate}
     setNewPost={setNewPost}
     newPost={newPost}
     update={update}
     name={name}
     userData={userData}
     userImg={userImg}
    />
    <Repost 
    user={userCtx as UserProps}
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
    setPostFeedStatesCount={setPostFeedStatesCount}
    setProfPostCheck={setProfPostCheck}
    
   />
  </div>
  </div>
  </div>
  : <>
  <div style={{display:"none"}}>
  <Repost 
    user={userCtx as UserProps}
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
    setPostFeedStatesCount={setPostFeedStatesCount}
    />
    </div>
  </>
)

let repostsFromUser = postsArray?.map(post =>  
  
    //user.reposts?.find(repost => repost === post.postID) 
    post.repostByUsers.includes(newPostValue?.userID) ?
    <div className="post-container" key={post.postID} style={style}>
      {userCtx?.uid === post?.userID ? <button onClick={() => RemovePost(post)}>x</button> : <></>}
      <div className="user-container">
        <img className="profile-picture" alt="user icon" src={post?.imgUrl}></img>
        <span>
          <div className="user-name-post" onClick={() => RedirectToProfilePage(post)}>
            {post.username}
          </div>
        <div className="content" onClick={() => RedirectToPostPage(post)}>
          <li key={post.id} className="text-content-field">
            {post.textContent}
          </li>
        </div>
        </span>   
      </div>
      <Like 
      user={userCtx as UserProps} 
      post={post}
      /> 
      <BookmarkBtn 
        user={userCtx as UserProps} 
        post={post} 
        update={update} 
        setUpdate={setUpdate}
        bookmarkPosts={bookmarkPosts} 
        setBookmarkPosts={setBookmarkPosts}
        userData={userData}
        />
      <Comment 
       user={userCtx as UserProps}
       post={post}
       setUpdate={setUpdate}
       setNewPost={setNewPost}
       newPost={newPost}
       update={update}
       name={name}
       userData={userData}
       userImg={userImg}
      />
      <Repost 
        user={userCtx as UserProps}
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
        setPostFeedStatesCount={setPostFeedStatesCount}
        
      
      />
    </div>
    : <></>
  )

  let newRepostsFromUser = postsArray?.map(post => 
    //repost?.find(repost => repost.postID === post.postID) ?
    repost?.includes(post) ?
    <div className="post-container" key={post.postID} style={style}>
      {userCtx?.uid === post?.userID ? <button onClick={() => RemovePost(post)}>x</button> : <></>}
      <div className="user-container">
        <img className="profile-picture" alt="user icon" src={post?.imgUrl}></img>
        <span>
          <div className="user-name-post" onClick={() => RedirectToProfilePage(post)}>
            {post.username}
          </div>
        <div className="content" onClick={() => RedirectToPostPage(post)}>
          <li key={post.id} className="text-content-field">
            {post.textContent}
          </li>
        </div>
        </span>   
      </div>
      <Like 
      user={userCtx as UserProps} 
      post={post}
      /> 
      <BookmarkBtn 
        user={userCtx as UserProps} 
        post={post} 
        update={update} 
        setUpdate={setUpdate}
        bookmarkPosts={bookmarkPosts} 
        setBookmarkPosts={setBookmarkPosts}
        userData={userData}
        />
      <Comment 
       user={userCtx as UserProps}
       post={post}
       setUpdate={setUpdate}
       setNewPost={setNewPost}
       newPost={newPost}
       update={update}
       name={name}
       userData={userData}
       userImg={userImg}
      />
      <Repost 
        user={userCtx as UserProps}
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
        setPostFeedStatesCount={setPostFeedStatesCount}
      />
    </div>
    : <></>
  )

  // let bookmarkedPosts = bookmarkPosts?.map(post => post !== undefined ?
  //   <div className="post-container" key={post.postID} style={style}>
  //   {userCtx?.uid === post?.userID ? <button onClick={() => RemovePost(post)}>x</button> : <></>}
  //   <div className="user-container">
  //     <img className="profile-picture" alt="user icon" src={post?.imgUrl}></img>
  //     <span>
  //       <div className="user-name-post" onClick={() => RedirectToProfilePage(post)}>
  //         {post.username}
  //       </div>
  //     <div className="content" onClick={() => RedirectToPostPage(post)}>
  //       <li key={post.id} className="text-content-field">
  //         {post.textContent}
  //       </li>
  //     </div>
  //     </span>   
  //   </div>
  //   <Like 
  //   user={userCtx as UserProps} 
  //   post={post}
  //   /> 
  //   <BookmarkBtn 
  //   user={userCtx as UserProps} 
  //   post={post} 
  //   update={update} 
  //   setUpdate={setUpdate}
  //   />
  //   <Comment 
  //    user={userCtx as UserProps}
  //    post={post}
  //    setUpdate={setUpdate}
  //    setNewPost={setNewPost}
  //    newPost={newPost}
  //    update={update}
  //    name={name}
  //   />
  //   <Repost 
  //     user={userCtx as UserProps}
  //     post={post}
  //     setUpdate={setUpdate}
  //     setNewPost={setNewPost}
  //     newPost={newPost}
  //     update={update}
  //     name={name}
  //     repost={repost}
  //     setRepost={setRepost}
  //     userMainFeed={userMainFeed}
  //     setUserMainFeed={setUserMainFeed}
  //     profPost={profPost}
  //     setProfPost={setProfPost}
  //     addToStatesCount={addToStatesCount}
  //   />
  // </div>
  // : <></>)\

  if(user !== null) {

    return (
      <div>
        {isComment ? (
          
          <div>
          <div>{rootPost}</div>
          <div>{clickedPostParentPost}</div>
          <div>{clickedPost}</div>
          {/* <div>{newComment}</div> */}
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
            {/* <div>{profileResponsesFeed}</div> */}
          </div>  
        // ) : bookmarkUpdate === true ? (    
        //   <div>
        //     <div>{bookmarkedPosts}</div>
        //   </div>
        ) : search ? (
          
          <div>
            <button onClick={() => navigate(-1)}>
              <FiArrowLeft className="back-arrow-icon"/>
            </button>
            {loadSearch}</div>
        ) : (
          <div>
            <div>{neuPost}</div>
            <div>{loadPosts}</div>
          </div>
        )}
    </div>
    )

  } else {
    return (
      <div>
        </div>
    )
  }
  
  
}

export default Post