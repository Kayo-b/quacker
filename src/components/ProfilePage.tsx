import React, { useEffect, useContext } from 'react'
import { useParams, useLocation } from 'react-router-dom';
import { DocumentData, arrayUnion, arrayRemove, doc, setDoc , getDoc, collection, where, query, getDocs, orderBy} from "firebase/firestore"
import { db } from "../firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Post from '../components/Post';
import Feed from './Feed';
import EditProfile from './EditProfile';
import '../style/ProfilePage.css';
import { setgroups } from 'process';
import { profile } from 'console';
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
    setPosts
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
    console.log(userCtx?.uid,"USER PROFILE PAGE CONSOLE LOG")
    const img = document.getElementById('myimgprofile');
    const bkgImg = document.getElementById('profile-background');
    const imgposts = document.querySelectorAll('.profile-picture-profile-feed');
    const endpointLocation = useLocation();
    const holepath = endpointLocation.pathname;
    const endpoint = holepath.split('/')[2];
    
        console.log(userData?.mainFeed,"USER DATa")
    const fetchProfileImg = async() => {    
        const querySnapshot = await getDocs(query(collection(db, "posts"), orderBy("timestamp", "desc")));
        console.log("zzzzz!!",postsRenew)
            setPostsRenew([])
            console.log("zzzzz!!",postsRenew)
            querySnapshot.forEach((doc) => {
                setPostsRenew(prevValue => [...prevValue, doc.data()]);
            })
            console.log("fetcssssssssh!!",postsRenew)
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
                imgposts.forEach(post => {
                    post.setAttribute('src', docs.imgUrl)
                });
            })
    };

    //Modal variables
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    console.log(isModalOpen,"modal")
    
    //Modal for the comment popup
    function Modal({ isOpen, onClose, children }: ModalProps) {
        if (!isOpen) return null;
        return (
        <div className="modal">
            <div className="modal-content">
            <button className="close-button" onClick={onClose}>
                X
            </button>
            {children}
            </div>
        </div>
        );
    }
    
    const waitForStates = () => {
        if(profileStatesCount === 1) {
            const profileContainer = 
                document.querySelector(".user-container-profile-page-container") as HTMLElement;
            const postSubContainer = 
                document.getElementById("post-subcontainer") as HTMLElement;
            if(profileContainer) setTimeout(() => {
                profileContainer.style.visibility = "visible";
                //postSubContainer.style.visibility = "visible";
                setLoading(false);
                //setLoading2(false);
            }, 300)
        };
         setProfileStatesCount(0);
    };

    const waitForStates2 = async () => {
        console.log(profPostCheck, "profPost")
        const postSubContainer = document.getElementById("post-subcontainer") as HTMLElement;
        if(profPostCheck === 0) {
            setTimeout(() => {
                setLoading2(false);
                postSubContainer.style.visibility = "visible";
            }, 1000)
        };
        if(setProfPostCheck !== undefined) setProfPostCheck(0); 
    }
  
    const loadPostsList = (postOrComment: string) => {
        const postSubContainer = document.getElementById("post-subcontainer") as HTMLElement;
        
        if(postOrComment === "posts" && profPost === false) {
            if(setProfPost !== undefined) setProfPost(true);
            if(postSubContainer !== null) postSubContainer.style.visibility = "hidden";
            setLoading2(true);
        }
        else if(postOrComment === "responses" && profPost === true) {
            if(setProfPost !== undefined) setProfPost(false);
            if(postSubContainer !== null) postSubContainer.style.visibility = "hidden"
            setLoading2(true);
        }
    }

    const checkFollow = async() => {
        console.log(userData,'userData')
        const postSubContainer = document.getElementById("post-subcontainer") as HTMLElement;
        if(userData && userCtx) {
            const userRef1 = doc(db, 'users', userCtx?.uid);
            const userRef2 = doc(db, 'users', userData?.uid);
            const userDoc1 = await getDoc(userRef1);
            const userDoc2 = await getDoc(userRef2);
            if(userDoc1.exists()) {
                console.log("check follow2");
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
                // const displayName = userData2.displayedName;
                // setDisplayedName(displayName)
                setBioText(bioTxt);
                console.log(userCtx,"userDsATA")
                setFollowingCount(following.length);
                setFollowersCount(followers.length);
            }
            
            // setLoading2(false);
            // postSubContainer.style.visibility = "visible";
            // setTimeout(() => {
            //     setLoading2(false);
            //     postSubContainer.style.visibility = "visible";
            // }, 200)
            console.log(loading2,"LOADING")
        }

        //setProfilePageStateCount(!profilePageStateCount)
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
    //setProfilePageStateCount(!profilePageStateCount)
    }

    useEffect(() => {
        waitForStates2();
    },[profPostCheck])
    

    useEffect(() => {
        checkFollow();
        waitForStates();
        fetchProfileImg();
    },[profileStatesCount, displayedName, bioText, post, update, profPostCheck])

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
    />
    } </UserContext.Provider>
    
console.log(postsRenew,"posts heres??s?")
console.log(post,"posts here?!!!!?")
  return (
    <div>{loading ? "Loading...." : null}
    <div className="user-container-profile-page-container" style={{visibility:"hidden"}}>
        {userData?.displayedName}
        <div className="user-container-profile-page">
            <div id="profile-background" style={{backgroundImage:`url(${userData?.bkgImgUrl})`}}>
                <img className="profile-picture-profile-page" id="myimgprofile" alt="user icon" src={userData?.imgUrl}></img>
            </div>
            <div id="profile-info">
                    <div className="user-name">
                        @{userData?.name}{userData?.uid !== userCtx?.uid ? <button onClick={() => followUser()}>{userData?.followers.includes(userCtx?.uid) ? "Unfollow" : "Follow"}</button> : null}
                        {userData?.uid === userCtx?.uid ? <button onClick={openModal}>Edit Profile</button> : null}
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
                <div className="follow-stats">
                {userData?.following.length} Following / {userData?.followers.length < followersCount ? followersCount : userData?.followers.length}  Followers
                </div>
                <div className="bio-container">
                    <p>{userData?.bioText}</p>
                </div>
                </div>
            </div>
            <div className="feed-container">
                <div className="feed-types-select">
                    <div className="quacks-select" onClick={(e) => loadPostsList("posts")}>Quacks</div>
                    <div className="responses-select" onClick={(e) => loadPostsList("responses")}>Responses</div>
                </div>
                <div className="feed-display">                                
                {loading2 ? "Loading..." : null}
                <div id="post-subcontainer" style={{visibility:"hidden"}}>{renderPosts}</div>
                </div>
            </div>
    </div>
    </div>
  )
}

export default ProfilePage