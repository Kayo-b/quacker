import React, {useEffect} from 'react'
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
    repost?: DocumentData[];
    setRepost?: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    userMainFeed?: DocumentData[];
    setUserMainFeed: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    
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
  setUserMainFeed
  }) => {

    
//   const postID = useParams<{postID: string}>()
  const location = useLocation() as { state: { post: DocumentData } };
  const [loading, setLoading] = React.useState(true);
  const [postPageStatesCount, setPostFeedStatesCount] = React.useState<number>(0)
  const post = location.state?.post
  const isComment = true;

  console.log(postPageStatesCount)

  const waitForStates = () => {
    const postPageContainer = 
            document.querySelector(".post-page-main-container") as HTMLElement;
    const postPageContainers = 
            document.querySelectorAll(".post-page-container");
    if(postPageStatesCount === 1) {
      console.log("OOOOOOOOOOOOOOOW")
      
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
 },[postPageStatesCount])

 console.log("YEEEAHHHh")
 
 
  return (

      <div>{loading ? "Loading...#" : null}
      <div className="post-page-main-container" style={{visibility:"hidden"}}>
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
          repost={repost}
          setRepost={setRepost}
          userMainFeed={userMainFeed}
          setUserMainFeed={setUserMainFeed}
          setLoading={setLoading}
          addToStatesCount={setPostFeedStatesCount}
          
          />
      </div>
    </div>
  )
}

export default PostPage