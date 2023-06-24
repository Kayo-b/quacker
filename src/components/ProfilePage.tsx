import React, { useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom';
import { DocumentData, arrayUnion, arrayRemove, doc, setDoc , getDoc, collection, where, query, getDocs} from "firebase/firestore"
import { db } from "../firebase";
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
    const [followBtn, setFollowBtn] = React.useState<boolean>(false)
    const [followingCount, setFollowingCount] = React.useState<number>(0)
    const [followersCount, setFollowersCount] = React.useState<number>(0)
    const [loading, setLoading] = React.useState(true);
    const [rdyStatesCount, setRdyStatesCount] = React.useState<number>(0)

    console.log(post,"POST**********************")
    // const profPost: boolean = true;
    // const profResp: boolean = false;
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
    setProfPost={setProfPost}
    addToStatesCount={setRdyStatesCount}
    />
    const waitForStateCounts = () => {
        if(rdyStatesCount === 1) {
            setLoading(false)
            const profileContainer = 
                document.querySelector(".user-container-profile-page-container") as HTMLElement;
            if(profileContainer) profileContainer.style.visibility = "visible"
        }
    }
    const loadPostsList = (postOrComment: string) => {
        //const postList = posts.filter((postVal: DocumentData) => postVal.uid === post.uid);
        if(postOrComment === "posts") {
            setProfPost(true);
        }
        else if(postOrComment === "responses") {
            setProfPost(false)
        }
    }



    const checkFollow = async() => {
        const userRef1 = doc(db, 'users', user.uid);
        const userRef2 = doc(db, 'users', post.userID);
        const userDoc1 = await getDoc(userRef1);
        const userDoc2 = await getDoc(userRef2);
        console.log("check follow1")
        if(userDoc1.exists()) {
            console.log("check follow2");
            const userData1 = userDoc1.data();
            const following = userData1.following;
            if(following.includes(post.userID)) {
                setFollowBtn(true);
            } else {
                setFollowBtn(false);
            }
        }
        if(userDoc2.exists()) {
            const userData2 = userDoc2.data();
            const following = userData2.following;
            const followers = userData2.followers;
            setFollowingCount(following.length);
            setFollowersCount(followers.length);
        }
    }

    const followUser = async() => {
        console.log("follow!", post)
        const userRef1 = doc(db, 'users', user.uid);
        const userRef2 = doc(db, 'users', post.userID);
        if(followBtn === false) {
            setDoc(userRef1, {following: arrayUnion(post.userID)}, {merge: true});
            setDoc(userRef2, {followers: arrayUnion(user.uid)}, {merge: true});
            setFollowBtn(true);
            setFollowersCount(followersCount + 1)
        } else {
            setDoc(userRef1, {following: arrayRemove(post.userID)}, {merge: true});
            setDoc(userRef2, {followers: arrayRemove(user.uid)}, {merge: true});
            setFollowBtn(false);
            setFollowersCount(followersCount - 1)
        }

        //const userDoc1 = await getDoc(userRef1);
        // const userDoc2 = await getDoc(userRef2);
        // if(userDoc1.exists() && userDoc2.exists()) {
        //     setDoc(userRef1, {following: arrayUnion(post.userID)}, {merge: true})
        //     setDoc(userRef2, {followers: arrayUnion(user.uid)}, {merge: true})
        // }

    }
    useEffect(() => {
        checkFollow();
        waitForStateCounts();

    },[rdyStatesCount])

  return (
    <div>{loading ? "Loading..." : null}
    <div className="user-container-profile-page-container" style={{visibility:"hidden"}}>
        {post.username}
        <div className="user-container-profile-page">
            <img className="profile-picture-profile-page" alt="user icon" src={myImg}></img>
                <div className="user-name">
                    @{post.username}{post.userID !== user.uid ? <button onClick={() => followUser()}>{followBtn === false ? "Follow" : "Unfollow"}</button> : null}
                </div>
            </div>
            <div className="follow-stats">
            {followingCount} Following / {followersCount}  Followers
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
    </div>
  )
}

export default ProfilePage