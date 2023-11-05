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
  setUpdateFollow
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
 
 
  return (

      <div>{loading ? "Loading....#" : null}
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
          
        />    
      </div>
    </div>
  )
}

export default PostPage