import React, { useEffect } from 'react';
import { DocumentData, arrayUnion, arrayRemove, doc, setDoc , getDoc, collection, where, query, getDocs} from "firebase/firestore"
import { db } from "../firebase";

type FollowBtnProps = {}

const FollowBtn: React.FC<FollowBtnProps> = ({}) => {

const functionTest = () => {
  console.log("Hey This is a test!")
  return "a"
}

  return (
    <div>{functionTest()}</div>
  )
}

export default FollowBtn;