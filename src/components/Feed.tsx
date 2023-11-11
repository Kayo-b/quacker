import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate  } from "react-router-dom";
import { UserContext } from '../App';
import Post from "./Post";
import {
    getDocs, 
    collection, 
    serverTimestamp, 
    SnapshotOptions, 
    DocumentData, 
    orderBy, 
    setDoc, 
    doc,
    where
    } 
    from "firebase/firestore";
import { db } from "../firebase";
import { query } from "firebase/firestore"
import { idText } from "typescript";

type UserProps = {
    authProvider?: string;
    email: string;
    name?: string;
    uid: string;
    bookmarks?: Array<string>;
}  
type PostProps = {
    name:string;
    setUpdate: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    update: undefined | boolean;
    setNewPost: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    newPost: DocumentData[];
    user: UserProps;
    posts: DocumentData[];
    postsRenew?: DocumentData[];
    post?: DocumentData;
    setPosts?: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    setPostsRenew?: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    bookmarkPosts?: DocumentData[];
    setBookmarkPosts: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    repost?: DocumentData[];
    setRepost?: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    userMainFeed?: DocumentData[];
    setUserMainFeed: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    updateFollow?: boolean;
    setUpdateFollow?:React.Dispatch<React.SetStateAction<boolean>>;
    isComment?: boolean | undefined;
    parentPost?: DocumentData;
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
    addToStatesCount?: React.Dispatch<React.SetStateAction<number>>;
    postPageStatesCount?: number;
    setPostFeedStatesCount?: React.Dispatch<React.SetStateAction<number>>;


  };

const Feed: React.FC<PostProps> = ({
    name,
    setUpdate,
    update, 
    newPost, 
    setNewPost, 
    user, 
    posts, 
    setPosts,
    bookmarkPosts, 
    setBookmarkPosts,
    post,
    repost,
    setRepost,
    userMainFeed,
    setUserMainFeed,
    updateFollow,
    setUpdateFollow,
    isComment,
    parentPost,
    addToStatesCount,
    postPageStatesCount,
    setPostFeedStatesCount
    }) => {

    //const [posts, setPosts] = useState<DocumentData[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [feedUpdate, setFeedUpdate] = React.useState(false);
    const [mainFeedStatesCount, setMainFeedStatesCount] = React.useState<number>(0);
    //const [updateFollow, setUpdateFollow] = React.useState<boolean>(false);
    const { search } = useParams();
    const navigate = useNavigate();
    const userCtx = useContext(UserContext);

    // //Function that will change updateFollow State and be passed as prop to FollowBtn
    // const handleFollow = () => {
    //     setUpdateFollow(!updateFollow);
    //     console.log(updateFollow,"updateFollow")
    // }
    // const loadingScreen = () => {
    //     if(loading) {
    //         const postPageContainers = document.querySelectorAll(".post-page-container");
    //         postPageContainers.forEach((container: Element) => {
    //         (container.parentElement?.parentElement as HTMLElement).style.visibility = "hidden";
    //         });
    //     }
    // }    

    const fetchPosts = async () => {
        
        //const q = await getDocs(query(collection(db, "posts"), orderBy("timestamp", "desc")))
        const querySnapshot = await getDocs(query(collection(db, "posts"), orderBy("timestamp", "desc")));
        console.log("fetch!!!!.")
        if(setPosts){
            setPosts([])
            setNewPost([])//making new posts array empty to avoid duplicate posts
            querySnapshot.forEach((doc) => {
                setPosts(prevValue => [...prevValue, doc.data()]);
            })
        }
        
    };

    const waitForStates = () => {
        if(mainFeedStatesCount === 1 || postPageStatesCount === 1) {
            const mainFeedContainer = 
                document.querySelector(".feed-main-container") as HTMLElement;
            if(mainFeedContainer) setTimeout(() => {
                mainFeedContainer.style.visibility = "visible";
                setLoading(false)
            }, 400) 
        }
    };



    useEffect(() => {
        setFeedUpdate(!update)
        fetchPosts();
        waitForStates();   
    },[mainFeedStatesCount, postPageStatesCount, update]);

    const loadingSvg = 
    <svg xmlns="http://www.w3.org/2000/svg" width="94px" height="94px" viewBox="0 0 100 150" preserveAspectRatio="xMidYMid">
        <circle cx="50" cy="50" fill="none" stroke="#6a6a6a" stroke-width="2" r="25" stroke-dasharray="141.37166941154067 49.12388980384689">
        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="0.7633587786259541s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
        </circle>
    </svg>

    if(user !== null) {return(
        
        <div>
            <div className="loading-element-container" style={{border: loading ? "1px solid rgba(245, 245, 245, 0.307)" : "none"}}>
                <div>{loading ? loadingSvg : null}</div>
            </div>
        <div className="feed-main-container" style={{visibility:"hidden"}}> 
        <UserContext.Provider value={userCtx as UserProps}> {
            <Post 
            name={name}
            newPost={newPost}
            setNewPost={setNewPost}
            update={update}
            setUpdate={setUpdate}
            posts={posts}
            setPosts={setPosts}
            post={post}
            user={user}
            bookmarkPosts={bookmarkPosts} 
            setBookmarkPosts={setBookmarkPosts}
            repost={repost}
            setRepost={setRepost}
            userMainFeed={userMainFeed}
            setUserMainFeed={setUserMainFeed}
            addToStatesCount={setMainFeedStatesCount}
            search={search}
            setUpdateFollow={setUpdateFollow} 
            updateFollow={updateFollow}
            isComment={isComment}
            parentPost={parentPost}
            setLoading={setLoading}
            setPostFeedStatesCount={setPostFeedStatesCount}
            />
        } </UserContext.Provider>
        </div>
        </div>
        
    )} else {
        return (
            <></>
        )
    }
}

export default Feed;