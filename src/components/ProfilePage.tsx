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
    const [profPostCheck, setProfPostCheck] = React.useState<number>(0)
    const location = useLocation() as { state: { post: DocumentData } };
    const post = location.state?.post;
    const [followBtn, setFollowBtn] = React.useState<boolean>(false)
    const [followingCount, setFollowingCount] = React.useState<number>(0)
    const [followersCount, setFollowersCount] = React.useState<number>(0)
    const [loading, setLoading] = React.useState(true);
    const [profileStatesCount, setProfileStatesCount] = React.useState<number>(0)

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
    addToStatesCount={setProfileStatesCount}
    setProfPostCheck={setProfPostCheck}
    />
    const waitForStates = () => {
        if(profileStatesCount === 1) {
            const profileContainer = 
                document.querySelector(".user-container-profile-page-container") as HTMLElement;
                const postSubContainer = document.getElementById("post-subcontainer") as HTMLElement;
            if(profileContainer) setTimeout(() => {
                profileContainer.style.visibility = "visible";
                postSubContainer.style.visibility = "visible";
                setLoading(false);
            }, 200)
        }
        setProfileStatesCount(0)
    }

    const waitForStates2 = () => {
        console.log(profPostCheck, ";;;;;;;;;;;;;;;;;")
        const postSubContainer = document.getElementById("post-subcontainer") as HTMLElement;
        if(profPostCheck === 1) {
            console.log("AOKEOEKAEOKAEOKOAE----1")
            setTimeout(() => {
                setLoading(false);
                postSubContainer.style.visibility = "visible";
            }, 100)
        }
        setProfPostCheck(0)
        
    }
    
    const loadPostsList = (postOrComment: string) => {
        const postSubContainer = document.getElementById("post-subcontainer") as HTMLElement;
        
        //console.log(document.getElementById("post-subcontainer"))
        //const postList = posts.filter((postVal: DocumentData) => postVal.uid === post.uid);
        if(postOrComment === "posts") {
            console.log(profPostCheck,"runs of false")
            setProfPost(true);
            
            if(postSubContainer !== null) postSubContainer.style.visibility = "hidden";
            setLoading(true);

            // setTimeout(() => {
            //     setLoading(false);
            //     postSubContainer.style.visibility = "visible";
            // }, 100)
        }
        else if(postOrComment === "responses") {
            setProfPost(false);
            if(postSubContainer !== null) postSubContainer.style.visibility = "hidden"
            setLoading(true);

        //     if(profPostCheck){
        //         console.log("AOKEOEKAEOKAEOKOAE----2")
        //         setTimeout(() => {
        //         setLoading(false);
        //         postSubContainer.style.visibility = "visible"
        //     }, 100)
            
        // }
        
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

    }
    useEffect(() => {
        waitForStates2();
        console.log("HIII")
    },[profPostCheck])
    
    useEffect(() => {
        checkFollow();
        waitForStates();
        

    },[profileStatesCount])



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
                {loading ? "Loading..." : null}
                <div id="post-subcontainer">{renderPosts}</div>
                       
                </div>

            </div>
    </div>
    </div>
  )
}

export default ProfilePage