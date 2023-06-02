import React from 'react'
import { useParams, useLocation } from 'react-router-dom';
import { DocumentData } from 'firebase/firestore';
import myImg from '../img/user-icon.png';

type UserProps = {
    authProvider?: string;
    email: string;
    name?: string;
    uid: string;
    bookmarks?: Array<string>;
  }  
  
  type PostProps = {
    //   name: string;
    //   setNewPost: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    //   newPost: DocumentData[] ;
    //   posts: DocumentData[] ;
    //   update: undefined | boolean;
    //   setUpdate: React.Dispatch<React.SetStateAction<boolean | undefined>>;
      user: UserProps;
      name: string;
    //   bookmarkPosts?: DocumentData[];
    //   setBookmarkPosts: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    //   isComment?: boolean | undefined;
    //   parentPost?: DocumentData;
    //   post?: DocumentData;
  }
const ProfilePage: React.FC<PostProps> = ({user, name}) => {
  return (
    <div>
        {name}
        <div className="user-container-profile-page">
            <img className="profile-picture-profile-page" alt="user icon" src={myImg}></img>
                <div className="user-name">
                    {name}
                </div>
            </div>

    </div>
  )
}

export default ProfilePage