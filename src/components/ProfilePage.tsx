import React, { useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom';
import { MdClose } from "react-icons/md";
import { DocumentData, arrayUnion, arrayRemove, doc, setDoc , getDoc, collection, where, query, getDocs, orderBy} from "firebase/firestore"
import { db } from "../firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Post from '../components/Post';
import EditProfile from './EditProfile';
import '../style/ProfilePage.css';
import { UserContext } from '../App';


type UserProps = {
    authProvider?: string;
    email: string;
    name?: string;
    uid: string;
    bookmarks?: Array<string>;
  }  

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }
  
  type PostProps = {
      name: string;
      setNewPost: React.Dispatch<React.SetStateAction<DocumentData[]>>;
      newPost: DocumentData[] ;
      posts: DocumentData[] ;
      setPosts?: React.Dispatch<React.SetStateAction<DocumentData[]>>;
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
      profPost?: boolean;
      setProfPost?: React.Dispatch<React.SetStateAction<boolean>>;
      profPostCheck: number;
      setProfPostCheck?: React.Dispatch<React.SetStateAction<number>>;
      userImg?: string;

      
  }
const ProfilePage: React.FC<PostProps> = ({
    update, 
    posts, 
    name,
    user, 
    bookmarkPosts, 
    newPost, 
    repost, 
    setRepost, 
    setNewPost, 
    setBookmarkPosts, 
    setUpdate,
    userMainFeed,
    setUserMainFeed,
    profPost,
    setProfPost,
    profPostCheck,
    setProfPostCheck,
    setPosts,
    userImg
    }) => {

    // const [profPost, setProfPost] = React.useState<boolean>(true);
    // const [profPostCheck, setProfPostCheck] = React.useState<number>(0);
    const [followBtn, setFollowBtn] = React.useState<boolean>(false);
    const [followingCount, setFollowingCount] = React.useState<number>(0);
    const [followersCount, setFollowersCount] = React.useState<number>(0);
    const [loading, setLoading] = React.useState(true);
    const [loading2, setLoading2] = React.useState(true);
    const [profileStatesCount, setProfileStatesCount] = React.useState<number>(0);
    const [profilePageStateCount, setProfilePageStateCount] = React.useState<boolean>(false);
    const [savePostUser, setSavePostUser] = React.useState<string>('');
    const [bioText, setBioText] = React.useState<string>('');
    const [displayedName, setDisplayedName] = React.useState<string>('');
    const storage = getStorage();
    const userCtx = useContext(UserContext);
    const [postsRenew, setPostsRenew] = React.useState<DocumentData[]>([]);
    const [userData, setUserData] = React.useState<DocumentData>();

    //Getting post data via location
    const location = useLocation() as {state: { post: DocumentData}};
    const post = location.state?.post;
    const img = document.getElementById('myimgprofile');
    const bkgImg = document.getElementById('profile-background');
    const imgposts = document.querySelectorAll('.profile-picture-profile-feed');
    const endpointLocation = useLocation();
    const holepath = endpointLocation.pathname;
    const endpoint = holepath.split('/')[2];


    const fetchProfileImg = async() => {    
        const querySnapshot = await getDocs(query(collection(db, "posts"), orderBy("timestamp", "desc")));
            setPostsRenew([])
            querySnapshot.forEach((doc) => {
                setPostsRenew(prevValue => [...prevValue, doc.data()]);
            })
            const userDocRef2 = query(collection(db, "users"));
            const userQuery = query (userDocRef2, where("name", "==", `${endpoint}`));
            //const userDocSnap = await getDoc(userDocRef);
            const userDocSnapData2 = await getDocs(userQuery)
            userDocSnapData2.forEach(val => {
                var docs = val.data();
                setUserData(docs);
                setUserMainFeed(docs.mainFeed.reverse())
                img?.setAttribute('src', docs.imgUrl)
                bkgImg?.setAttribute('style', `background-image: url(${docs.bkgImgUrl})`)
                // imgposts.forEach(post => {
                //     post.setAttribute('src', docs.imgUrl)
                // });
            })
    };

    //Modal variables
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    //Modal for the comment popup
    function Modal({ isOpen, onClose, children }: ModalProps) {
        if (!isOpen) return null;
        return (
        <div className="modal">
            <div className={"gif-modal-wrapper"} onClick={onClose}></div>
            <div className="modal-content">
            <button className="close-button-edit-profile" onClick={onClose}>
                <MdClose style={{width:'25px', height:'25px'}}/>
            </button>
            {children}
            </div>
        </div>
        );
    }

    const waitForStates = () => {
        const profileContainer = 
        document.querySelector(".user-container-profile-page-container") as HTMLElement;
        const postSubContainer = 
        document.getElementById("post-subcontainer") as HTMLElement;
        const postsElement = document.querySelector(".quacks-select") as HTMLElement;
        const responsesElement = document.querySelector(".responses-select") as HTMLElement;
        if(profPost) {
            postsElement.style.color = "white";
            responsesElement.style.color = "#5b5f62";
        } else {
            responsesElement.style.color = "white"
            postsElement.style.color = "#5b5f62";
        }

        if(profileStatesCount === 1) {
            if(profileContainer) setTimeout(() => {
                profileContainer.style.visibility = "visible";
                //postSubContainer.style.visibility = "visible";
                setLoading(false);
                if(setProfPostCheck !== undefined)
                setProfPostCheck(1)
                setLoading2(false);
            }, 300)
        };
         setProfileStatesCount(0);
        if(userMainFeed?.length === 0) setTimeout(() =>{
            profileContainer.style.visibility = "visible";
                setLoading(false);
                setLoading2(false);
        },400)
    };

    const waitForStates2 = async () => {
        const postSubContainer = document.getElementById("post-subcontainer") as HTMLElement;
        if(profPostCheck === 1 || posts.length === 0) {
            setTimeout(() => {
                setLoading2(false);
                postSubContainer.style.visibility = "visible";
            }, 700)
        };
        if(setProfPostCheck !== undefined) {setProfPostCheck(0);}
        
    }
  
    const loadPostsList = (postOrComment: string) => {
        const postSubContainer = document.getElementById("post-subcontainer") as HTMLElement;
        const postsElement = document.querySelector(".quacks-select") as HTMLElement;
        const responsesElement = document.querySelector(".responses-select") as HTMLElement;
        if(postOrComment === "posts" && profPost === false) {
            if(setProfPost !== undefined) setProfPost(true);
            if(postSubContainer !== null) postSubContainer.style.visibility = "hidden";
            postsElement.style.color = "white";
            responsesElement.style.color = "#5b5f62"
            setLoading2(true);
        }
        else if(postOrComment === "responses" && profPost === true) {
            if(setProfPost !== undefined) setProfPost(false);
            if(postSubContainer !== null) postSubContainer.style.visibility = "hidden"
            responsesElement.style.color = "white"
            postsElement.style.color = "#5b5f62";
            setLoading2(true);
        }
        
    }

    const checkFollow = async() => {
        const postSubContainer = document.getElementById("post-subcontainer") as HTMLElement;
        if(userData && userCtx) {
            const userRef1 = doc(db, 'users', userCtx?.uid);
            const userRef2 = doc(db, 'users', userData?.uid);
            const userDoc1 = await getDoc(userRef1);
            const userDoc2 = await getDoc(userRef2);
            if(userDoc1.exists()) {
               
                const userData1 = userDoc1.data();
                const following = userData1.following;
                if(following.includes(userData?.uid)) {
                    setFollowBtn(true);
                } else {
                    setFollowBtn(false);
                }
            }
            if(userDoc2.exists()) {
                const userData2 = userDoc2.data();
                const following = userData2.following;
                const followers = userData2.followers;
                const bioTxt = userData2.bioText;
                setBioText(bioTxt);
                setFollowingCount(following.length);
                setFollowersCount(followers.length);
            }
        }
    }

    const followUser = async() => {
        if(userData && userCtx) {
            const userRef1 = doc(db, 'users', userCtx?.uid);
            const userRef2 = doc(db, 'users', userData?.uid);    
            if(followBtn === false) {
                setDoc(userRef1, {following: arrayUnion(userData?.uid)}, {merge: true});
                setDoc(userRef2, {followers: arrayUnion(userCtx?.uid)}, {merge: true});
                setFollowBtn(true);
                setFollowersCount(followersCount + 1);
            } else {
                setDoc(userRef1, {following: arrayRemove(userData?.uid)}, {merge: true});
                setDoc(userRef2, {followers: arrayRemove(userCtx?.uid)}, {merge: true});
                setFollowBtn(false);
                setFollowersCount(followersCount - 1);
            }
    }
    setBioText(bioText + ".")
    }

    useEffect(() => {
        checkFollow();
        waitForStates2();
    },[profPostCheck, update, userData])
    
    useEffect(() => {
        checkFollow();
        waitForStates();
        fetchProfileImg();
    },[profileStatesCount, displayedName, bioText, post, update, profPostCheck, profPost])

    useEffect(() => {

    },[posts, postsRenew]) 
    var renderPosts = 
    <UserContext.Provider value={userCtx as UserProps}> {
    <Post
    name={name}
    user={user}
    newPost={newPost}
    setNewPost={setNewPost}
    update={update}
    setUpdate={setUpdate}
    posts={posts}
    post={post}
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
    postsRenew={postsRenew}
    userData={userData}
    userImg={userImg}
    />
    } </UserContext.Provider>
    
  const loadingSvg = 
  <svg xmlns="http://www.w3.org/2000/svg" width="94px" height="94px" viewBox="0 0 100 150" preserveAspectRatio="xMidYMid">
      <circle cx="50" cy="50" fill="none" stroke="#6a6a6a" strokeWidth="2" r="25" strokeDasharray="141.37166941154067 49.12388980384689">
      <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="0.7633587786259541s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
      </circle>
  </svg>

  return (
    <div>
        <div className="loading-element-container" style={{border: loading ? "1px solid rgba(245, 245, 245, 0.307)" : "none"}}>
            <div>{loading ? loadingSvg : null}</div>
        </div>
    <div className="user-container-profile-page-container" style={{visibility:"hidden"}} data-testid="profile-page-container">
        {userData?.displayedName}
        <div className="user-container-profile-page" data-testid="profile-page-user-container">
            <div id="profile-background" style={{backgroundImage:`url(${userData?.bkgImgUrl})`}} data-testid="profile-background">
                <img className="profile-picture-profile-page" id="myimgprofile" alt="user icon" src={userData?.imgUrl} data-testid="profile-page-avatar"></img>
            </div>
            <div id="profile-info" data-testid="profile-info-section">
                    <div className="user-name" data-testid="profile-username-section">
                        @{userData?.name}{userData?.uid !== userCtx?.uid ? <button onClick={() => followUser()} data-testid="profile-follow-button">{userData?.followers.includes(userCtx?.uid) ? "Unfollow" : "Follow"}</button> : null}
                        {userData?.uid === userCtx?.uid ? <button onClick={openModal} data-testid="profile-edit-button">Edit Profile</button> : null}
                        <div className="modal-container">
                        <Modal isOpen={isModalOpen} onClose={closeModal}>   
                            {<EditProfile
                            user={userCtx as UserProps}
                            post={post}
                            posts={posts}
                            setUpdate={setUpdate}
                            setNewPost={setNewPost}
                            newPost={newPost}
                            update={update}
                            name={name}
                            bioText={bioText}
                            setBioText={setBioText}
                            setDisplayedName={setDisplayedName}
                            />}
                        </Modal>
                        </div>
                    </div>
                <div className="follow-stats" data-testid="profile-follow-stats">
                {userData?.following.length} Following | {userData?.followers.length < followersCount ? followersCount : userData?.followers.length}  Followers
                </div>
                <div className="bio-container" data-testid="profile-bio-container">
                    <p>{userData?.bioText}</p>
                </div>
                </div>
            </div>
            <div className="feed-container" data-testid="profile-feed-container">
                <div className="feed-types-select" data-testid="profile-feed-tabs">
                    <div className="quacks-select" onClick={(e) => loadPostsList("posts")} data-testid="profile-posts-tab">Posts</div>
                    <div className="responses-select" onClick={(e) => loadPostsList("responses")} data-testid="profile-replies-tab">Replies</div>
                </div>
                <div className="feed-display" data-testid="profile-feed-display">                                
                <div className="loading-element-container" style={{border: loading ? "1px solid rgba(245, 245, 245, 0.307)" : "none"}}>
                    <div>{loading2 ? loadingSvg : userMainFeed?.length === 0 && profPost === true ? "No posts" : null}</div>
                </div>
                <div id="post-subcontainer" style={{visibility:"hidden"}} data-testid="profile-posts-container">{renderPosts}</div>
                </div>
            </div>
    </div>
    </div>
  )
}

export default ProfilePage