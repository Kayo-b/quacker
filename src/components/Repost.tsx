import React from 'react'
import { useState, useEffect } from 'react';
import { BiRepost } from 'react-icons/bi';
import { DocumentData, arrayUnion, arrayRemove, doc, setDoc , getDoc, collection, where, query, getDocs} from "firebase/firestore"
import { db } from "../firebase";
import { count } from 'console';

type UserProps = {
    authProvider?: string;
    email: string;
    name?: string;
    uid: string;
    bookmarks?: Array<string>;
    reposts?: Array<string>;
  }  
  
  type PostProps = {
    user: UserProps;
    post?: DocumentData;
    newPost: DocumentData[];
    setNewPost: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    update: undefined | boolean;
    setUpdate: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    name?: string;
    repost?: DocumentData[];
    setRepost?: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    userMainFeed?: DocumentData[];
    setUserMainFeed: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    profPost?: boolean;
    setProfPost?: React.Dispatch<React.SetStateAction<boolean>>;
    addToStatesCount?: React.Dispatch<React.SetStateAction<number>>;
    setProfPostCheck?: React.Dispatch<React.SetStateAction<number>>;
    setPostFeedStatesCount?: React.Dispatch<React.SetStateAction<number>>;
    setBookmarksProfileStatesCount?: React.Dispatch<React.SetStateAction<number>>;
    
}

const Repost: React.FC<PostProps> = ({
    post, 
    user, 
    repost, 
    setRepost, 
    update, 
    setUpdate, 
    userMainFeed, 
    setUserMainFeed,
    setProfPost,
    profPost,
    addToStatesCount,
    setProfPostCheck,
    setPostFeedStatesCount,
    setBookmarksProfileStatesCount
    }) => {

  const [reposted, setReposted] = useState<boolean>(false);
  
  const hasUserReposted = async(postId: string) => {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      // const q = query(collection(db, 'users'), where("uid", "==",  user.uid));
      // const docs = await getDocs(q);
      // const userData = docs.docs[0].data();
      if(userDoc.exists()) {
          if(userDoc.data().reposts.includes(postId) || post?.repostByUsers.includes(user.uid)) {
            setReposted(true);
          } else {
            setReposted(false);
          }
          if(setPostFeedStatesCount)
              setPostFeedStatesCount(1)
          if(setBookmarksProfileStatesCount) {
            setBookmarksProfileStatesCount(1)
          }
          if(addToStatesCount) {
            addToStatesCount(1);
          };
            if(!profPost) {
              if(setProfPostCheck) setProfPostCheck(1)
            } 
      }
  }

  const removeRepost = (postId: string) => {
      if(setRepost) { 
        setRepost(
          prevRepost => 
              prevRepost
              .filter(
                  post =>
                      post.postID !== postId))
                    } 
      };
  
  const removeFromMainFeed = () => {
    if(setUserMainFeed) {
        setUserMainFeed(prevVal => prevVal.filter(value => value !== post?.postID))
    }
  }

  const substituteMainFeed = (newArray: DocumentData[]) => {
    setUserMainFeed(newArray)
    
  }
      
  const addRepostPost = (newPost: DocumentData) => {
        if(setRepost) setRepost(
            prevRepost => [...prevRepost, newPost]) 
        if(user.uid === post?.userID) {
          if(setUserMainFeed) {
            setUserMainFeed(
              prevVal => [post?.postID, ...prevVal]) 
        }
        } else if(setUserMainFeed) {
            setUserMainFeed(
              prevVal => [ ...prevVal, post?.postID]) 
        }
      }

async function addRepostData(postId: string, e: React.MouseEvent) {
  e.stopPropagation();
      const userRef = doc(db, 'users', user.uid);
      const postRef = doc(db, 'posts', post?.postID);
      const userDoc = await getDoc(userRef);
      if(!reposted) {
            setReposted(true);
            setDoc(userRef, {reposts: arrayUnion(postId)}, {merge: true});
            //Handling when the user reposts its own post
            if(post?.userID === user.uid) {
              if(userDoc.exists()) {
                const userData = userDoc.data();
                const mainFeed = userData.mainFeed;
                mainFeed.push(postId);
                setDoc(userRef, {mainFeed: mainFeed}, {merge: true});
              }

            } else {
              setDoc(userRef, {mainFeed: arrayUnion(postId)}, {merge: true});
            }
            setDoc(postRef, {repostByUsers: arrayUnion(user.uid)}, {merge: true})
            if(post) addRepostPost(post);

      } else {
            setReposted(false);
            //Handling when the user unreposts its own reposted post
            if(userDoc.exists()) {
              const userData = userDoc.data();
              const mainFeed = userData.mainFeed;
              //Getting the indexes of the unreposted posts that have the same ID
              const indexArray = mainFeed.reduce((acc: Array<number>, item: string, index: number) => {
                if(item === postId) {
                  acc.push(index);
                }
                return acc;
              },[])
              //If length of the resulting array is > 1, that means that we are dealing with a "self reposted" post
              //and that there are two posts in the main feed with the same ID, the second post(with higher index value)
              //will be the reposted post, this is the one removed so that the order of posts can been maintained
              if(indexArray.length > 1) {
                mainFeed.splice(indexArray[1], 1);
                setDoc(userRef, {mainFeed: mainFeed}, {merge: true});
                substituteMainFeed(mainFeed.reverse());
              } else {
                removeFromMainFeed();
                let newFeed = mainFeed.filter((post: string) => post !== postId);
                setDoc(userRef, {mainFeed: newFeed}, {merge: true});
              }
            }
            setDoc(userRef, {reposts: arrayRemove(postId)}, {merge: true});
            setDoc(postRef, {repostByUsers: arrayRemove(user.uid)}, {merge: true});
            removeRepost(post?.postID);
          }
      }
           
      useEffect(() => {
        hasUserReposted(post?.postID);
      },[])

      return(
          <div className="bm-main-container" data-testid="repost-button-container">
              <BiRepost onClick={(e) => addRepostData(post?.postID, e)} style={{color: reposted ? "blue": undefined }} data-testid="repost-button"/>
          </div>
      )
}

export default Repost