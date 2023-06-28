import React from 'react'
import { useState, useEffect } from 'react';
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
    setProfPostCheck
    }) => {

  const [reposted, setReposted] = useState<boolean>(false);

  const hasUserReposted = async(postId: string) => {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      // const q = query(collection(db, 'users'), where("uid", "==",  user.uid));
      // const docs = await getDocs(q);
      // const userData = docs.docs[0].data();
      if(userDoc.exists()) {
          if(userDoc.data().reposts.includes(postId)) {
            setReposted(true);
            console.log("hasUserREposted = true")
          } else {
            setReposted(false);
          }
          if(addToStatesCount) {
            addToStatesCount(1);
            console.log("reposted!!!")};
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
  
  console.log(repost)

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

      
      //See if there is a faster way to get the user's bookmarked posts, the query makes it take some time
    async function addRepost(postId: string) {
     
          console.log(post)
          
          // const q = query(collection(db, 'users'), where("uid", "==",  user.uid));
          // const docs = await getDocs(q);
          // const userRef = docs.docs[0].ref;
          // const userData = docs.docs[0].data();
          const userRef = doc(db, 'users', user.uid);
          const postRef = doc(db, 'posts', post?.postID);
          
        //   await setDoc(userRef, {
        //       mainFeed: arrayUnion(post?.postID)
        //   }, {merge: true})
          
          const userDoc = await getDoc(userRef);
          //const userData = userDoc.data();
          if(!reposted) {
                setReposted(true);
                // if(post?.userID !== user.uid){
                //   setDoc(userRef, {reposts: arrayUnion(postId)}, {merge: true});
                // }
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
                  // if(userDoc.exists()) {
                  //   const userData = userDoc.data();
                  //   const mainFeed = userData.mainFeed;
                  //   mainFeed.unshift(postId);
                  //   setDoc(userRef, {mainFeed: mainFeed}, {merge: true});
                  // }
                  setDoc(userRef, {mainFeed: arrayUnion(postId)}, {merge: true});
                  
                }
                setDoc(postRef, {repostByUsers: arrayUnion(user.uid)}, {merge: true})
                !update ? setUpdate(true) : setUpdate(false);
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
                      acc.push(index)
                    }
                    return acc;
                  },[])
                  //If length of the resulting array is > 1, that means that we are dealing with a "self reposted" post
                  //and that there are two posts in the main feed with the same ID, the second post(with higher index value)
                  //will be the reposted post, this is the one removed so that the order of posts can been maintained
                  if(indexArray.length > 1) {
                    mainFeed.splice(indexArray[1], 1);
                    setDoc(userRef, {mainFeed: mainFeed}, {merge: true});
                    console.log("1");
                    substituteMainFeed(mainFeed.reverse());
                  } else {
                    removeFromMainFeed();
                    let newFeed = mainFeed.filter((post: string) => post !== postId);
                    //substituteMainFeed(newFeed)
                    setDoc(userRef, {mainFeed: newFeed}, {merge: true});
                    console.log("2");
                  }
                }
                setDoc(userRef, {reposts: arrayRemove(postId)}, {merge: true});
                setDoc(postRef, {repostByUsers: arrayRemove(user.uid)}, {merge: true});
                !update ? setUpdate(true) : setUpdate(false)
                removeRepost(post?.postID);
              }
              
          }
           
      
      // const addBookmarkBtn = (postId: string) => {
      //     addBookmark(postId)
      // }
      function checkReposted() {
        
        repost?.forEach(item => {
          if(item.postID === post?.postID) {
            setReposted(true)
            
          } 
        })
      } 

      useEffect(() => {
        hasUserReposted(post?.postID);
        //Logic to only show reposts that have been reposted by the current logged user when accessing the user profile
        if(profPost) {
          console.log(")!!)!))!)!)!)!>>> TRUE")
          checkReposted()
        }
       
      },[repost])
     
      return(
          <div className="bm-main-container">
              <button onClick={() => addRepost(post?.postID)}>
                  {reposted ? "Reposted" : "Repost"}</button>
          </div>
      )
}

export default Repost