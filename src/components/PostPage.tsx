import React, {useEffect} from 'react'
import { useParams, useLocation } from 'react-router-dom';
import { DocumentData, arrayUnion, arrayRemove, doc, setDoc , getDoc, collection, where, query, getDocs} from "firebase/firestore"
import { db } from "../firebase";
import Post from "./Post";
import Feed from './Feed';
import Like from './Like'
import BookmarkBtn from './BookmarkBtn';
import myImg from '../img/user-icon.png';


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
    repost?: DocumentData[];
    setRepost?: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    userMainFeed?: DocumentData[];
    setUserMainFeed: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    setPosts?: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    addToStatesCount?: React.Dispatch<React.SetStateAction<number>>;
    updateFollow?: boolean;
    setUpdateFollow?:React.Dispatch<React.SetStateAction<boolean>>;
    userImg?: string;
    
}

const PostPage: React.FC<PostProps> = ({
  user, 
  update, 
  posts, 
  name, 
  bookmarkPosts, 
  newPost, 
  repost, 
  setRepost, 
  setNewPost, 
  setBookmarkPosts, 
  setUpdate,
  userMainFeed,
  setUserMainFeed,
  setPosts,
  addToStatesCount,
  updateFollow,
  setUpdateFollow,
  userImg
  }) => {

    
//   const postID = useParams<{postID: string}>()
  const location = useLocation() as { state: { post: DocumentData } };
  const [loading, setLoading] = React.useState(true);
  const [postPageStatesCount, setPostFeedStatesCount] = React.useState<number>(0)
  const [post, setPost] = React.useState<DocumentData>()
  const endpointLocation = useLocation();
  const holepath = endpointLocation.pathname;
  const endpoint = holepath.split('/')[2];
  
  
  const fetchPost = async() => {    
    const postDocRef = doc(db, "posts", endpoint);
    const postDocSnap = await getDoc(postDocRef);
    const postDocSnapData = postDocSnap.data();
    location.state?.post !== undefined ? 
    setPost(location.state?.post) :
    setPost(postDocSnapData);
};

  
  const isComment = true;

  const waitForStates = () => {
    const postPageContainer = 
            document.querySelector(".post-page-main-container") as HTMLElement;
    const postPageContainers = 
            document.querySelectorAll(".post-page-container");
    if(postPageStatesCount === 1) {
      
      setTimeout(() => {
          postPageContainers.forEach((container: Element) => {
              (container as HTMLElement).style.visibility = "visible";
              postPageContainer.style.visibility = "visible";
              console.log(container.parentElement as HTMLElement)
          });
            setLoading(false);
        }, 200)
    }
 }

 useEffect(() => {
  waitForStates();
  fetchPost();
 },[postPageStatesCount])
 
 const loadingSvg = 
 <svg xmlns="http://www.w3.org/2000/svg" width="94px" height="94px" viewBox="0 0 100 150" preserveAspectRatio="xMidYMid">
     <circle cx="50" cy="50" fill="none" stroke="#6a6a6a" stroke-width="2" r="25" stroke-dasharray="141.37166941154067 49.12388980384689">
     <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="0.7633587786259541s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
     </circle>
 </svg>

  return (
      <div>
         <div className="loading-element-container" style={{border: loading ? "1px solid rgba(245, 245, 245, 0.307)" : "none"}}>
                <div>{loading ? loadingSvg : null}</div>
            </div>
      <div className="post-page-main-container" style={{visibility:"hidden"}}>
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
          repost={repost}
          setRepost={setRepost}
          userMainFeed={userMainFeed}
          setUserMainFeed={setUserMainFeed}
          setLoading={setLoading}
          addToStatesCount={setPostFeedStatesCount}
          
          /> */}
      <Feed 
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
          repost={repost}
          setRepost={setRepost}
          userMainFeed={userMainFeed}
          setUserMainFeed={setUserMainFeed}
          setLoading={setLoading}
          postPageStatesCount={postPageStatesCount}
          setPostFeedStatesCount={setPostFeedStatesCount}
          setPosts={setPosts}
          updateFollow={updateFollow}
          setUpdateFollow={setUpdateFollow}
          userImg={userImg}
          
        />    
      </div>
    </div>
  )
}

export default PostPage