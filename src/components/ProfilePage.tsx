import React, { useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom';
import { DocumentData, arrayUnion, arrayRemove, doc, setDoc , getDoc, collection, where, query, getDocs} from "firebase/firestore"
import { db } from "../firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Post from '../components/Post';
import EditProfile from './EditProfile';
import '../style/ProfilePage.css';
import { setgroups } from 'process';
import { profile } from 'console';



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
    profPost,
    setProfPost,
    profPostCheck,
    setProfPostCheck
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

    //Getting post data via location
    const location = useLocation() as {state: { post: DocumentData}};
    const post = location.state?.post;
    const img = document.getElementById('myimgprofile');
    img?.setAttribute('src', post.imgUrl)

    //Getting profile image from storage
    // let storageRef = ref(storage, `images/${post?.userID}/profile_image/profile_img.png`)
    // console.log(post.userID, "USERID")
    // getDownloadURL(storageRef)
    // .then((url) => {
    //     console.log(url,"URL")
    //     const img = document.getElementById('myimgprofile');
    //     img?.setAttribute('src', url)
    // })

    //Modal variables
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    
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

        if(profileStatesCount === 1 || userMainFeed?.length === 0) {
            const profileContainer = 
                document.querySelector(".user-container-profile-page-container") as HTMLElement;
            const postSubContainer = 
                document.getElementById("post-subcontainer") as HTMLElement;
            if(profileContainer) setTimeout(() => {
                profileContainer.style.visibility = "visible";
                postSubContainer.style.visibility = "visible";
                setLoading(false);
                setLoading2(false);
            }, 300)
    
        };
         setProfileStatesCount(0);
    };

    const waitForStates2 = () => {
        const postSubContainer = document.getElementById("post-subcontainer") as HTMLElement;
        if(profPostCheck === 1) {
            setTimeout(() => {
                setLoading2(false);
                postSubContainer.style.visibility = "visible";
            }, 300)
        };
        if(setProfPostCheck !== undefined) setProfPostCheck(0); 
    }
  
    const loadPostsList = (postOrComment: string) => {
        const postSubContainer = document.getElementById("post-subcontainer") as HTMLElement;
        if(postOrComment === "posts") {
            if(setProfPost !== undefined) setProfPost(true);
            if(postSubContainer !== null) postSubContainer.style.visibility = "hidden";
            setLoading2(true);
        }
        else if(postOrComment === "responses") {
            if(setProfPost !== undefined) setProfPost(false);
            if(postSubContainer !== null) postSubContainer.style.visibility = "hidden"
            setLoading2(true);
        }
    }

    const checkFollow = async() => {
        const userRef1 = doc(db, 'users', user.uid);
        const userRef2 = doc(db, 'users', post.userID);
        const userDoc1 = await getDoc(userRef1);
        const userDoc2 = await getDoc(userRef2);
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
            const bioTxt = userData2.bioText;
            const displayName = userData2.displayedName;
            setDisplayedName(displayName)
            setBioText(bioTxt);
            console.log(userData2,"userDATA")
            setFollowingCount(following.length);
            setFollowersCount(followers.length);

        }
        setProfilePageStateCount(true)
    }

    const followUser = async() => {
        const userRef1 = doc(db, 'users', user.uid);
        const userRef2 = doc(db, 'users', post.userID);
        if(followBtn === false) {
            setDoc(userRef1, {following: arrayUnion(post.userID)}, {merge: true});
            setDoc(userRef2, {followers: arrayUnion(user.uid)}, {merge: true});
            setFollowBtn(true);
            setFollowersCount(followersCount + 1);
        } else {
            setDoc(userRef1, {following: arrayRemove(post.userID)}, {merge: true});
            setDoc(userRef2, {followers: arrayRemove(user.uid)}, {merge: true});
            setFollowBtn(false);
            setFollowersCount(followersCount - 1);
        }

    }
    
    useEffect(() => {
        
        if(savePostUser !== post.username) {
            setSavePostUser(post.username);
            const profileContainer = 
                    document.querySelector(".user-container-profile-page-container") as HTMLElement;
            profileContainer.style.visibility = "hidden";
            const postSubContainer = 
                    document.getElementById("post-subcontainer") as HTMLElement;
                    postSubContainer.style.visibility = "hidden";
            setLoading(true)
        
        }

    },[post])
        
    useEffect(() => {
        waitForStates2();
    },[profPostCheck])
    

    useEffect(() => {
        checkFollow();
        waitForStates();
    },[profileStatesCount, post])

    console.log(post.imgUrl,"POST IMG")

  return (
    <div>{loading ? "Loading...." : null}
    <div className="user-container-profile-page-container" style={{visibility:"hidden"}}>
        {displayedName}
        <div className="user-container-profile-page">
            <>{console.log(post.imgUrl,"POST IMG2")}</>
            <img className="profile-picture-profile-page" id="myimgprofile" alt="user icon" src={post.imgUrl}></img>
                <div className="user-name">
                    @{post.username}{post.userID !== user.uid ? <button onClick={() => followUser()}>{followBtn === false ? "Follow" : "Unfollow"}</button> : null}
                    {post.userID === user.uid ? <button onClick={openModal}>Edit Profile</button> : null}
                    <Modal isOpen={isModalOpen} onClose={closeModal}>   
                        {<EditProfile
                        user={user}
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
            <div className="follow-stats">
            {followingCount} Following / {followersCount}  Followers
            </div>
            <div className="bio-container">
                <p>{bioText}</p>
            </div>
            <div className="feed-container">
                <div className="feed-types-select">
                    <div className="quacks-select" onClick={() => loadPostsList("posts")}>Quacks</div>
                    <div className="responses-select" onClick={() => loadPostsList("responses")}>Responses</div>
                </div>
                <div className="feed-display">                                
                {loading2 ? "Loading..." : null}
                <div id="post-subcontainer">{renderPosts}</div><>{console.log('render!!!!!')}</>
                </div>
            </div>
    </div>
    </div>
  )
}

export default ProfilePage