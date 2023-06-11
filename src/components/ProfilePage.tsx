import React, { useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom';
import { DocumentData } from 'firebase/firestore';
import Post from '../components/Post';
import myImg from '../img/user-icon.png';
import '../style/ProfilePage.css';
import { setgroups } from 'process';



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
      post?: DocumentData;
      bookmarkPosts?: DocumentData[];
      setBookmarkPosts: React.Dispatch<React.SetStateAction<DocumentData[]>>;
      isComment?: boolean | undefined;
      parentPost?: DocumentData;
      repost?: DocumentData[];
      setRepost?: React.Dispatch<React.SetStateAction<DocumentData[]>>;
      userMainFeed?: DocumentData[];
      setUserMainFeed: React.Dispatch<React.SetStateAction<DocumentData[]>>;
  }
const ProfilePage: React.FC<PostProps> = ({
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
      
    const [profPost, setProfPost] = React.useState<boolean>(true);
    const location = useLocation() as { state: { post: DocumentData } };
    const post = location.state?.post;
    // const profPost: boolean = true;
    // const profResp: boolean = false;
    console.log(post, "<<<<, POST")
    var renderPosts = 
    <Post 
    name={name}
    newPost={newPost}
    setNewPost={setNewPost}
    update={update}
    setUpdate={setUpdate}
    posts={posts}
    post={post}
    user={user}
    bookmarkPosts={bookmarkPosts} 
    setBookmarkPosts={setBookmarkPosts}
    profPost={profPost}
    repost={repost}
    setRepost={setRepost}
    userMainFeed={userMainFeed}
    setUserMainFeed={setUserMainFeed}
    />
    // var renderResponses = 
    // <Post 
    // name={name}
    // newPost={newPost}
    // setNewPost={setNewPost}
    // update={update}
    // setUpdate={setUpdate}
    // posts={posts}
    // post={post}
    // user={user}
    // bookmarkPosts={bookmarkPosts} 
    // setBookmarkPosts={setBookmarkPosts}
    // profResp={profResp}
    // />
    
    const loadPostsList = (postOrComment: string) => {
        
        //const postList = posts.filter((postVal: DocumentData) => postVal.uid === post.uid);
        if(postOrComment === "posts") {
            setProfPost(true);
        }
        
        else if(postOrComment === "responses") {
            setProfPost(false)
        }
    
    }


  return (
    <div>
        {post.username}
        <div className="user-container-profile-page">
            <img className="profile-picture-profile-page" alt="user icon" src={myImg}></img>
                <div className="user-name">
                    @{post.username}
                </div>
            </div>
            <div className="follow-stats">
            n Following / n Followers
            </div>
            <div className="feed-container">
                <div className="feed-types-select">
                    <div className="quacks-select" onClick={() => loadPostsList("posts")}>Quacks</div>
                    <div className="responses-select" onClick={() => loadPostsList("responses")}>Responses</div>
                </div>
                <div className="feed-display">                                
                {renderPosts}
                       
                </div>

            </div>
    </div>
    
  )
}

export default ProfilePage