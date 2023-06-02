import React from 'react'

type UserProps = {
    authProvider?: string;
    email: string;
    name?: string;
    uid: string;
    bookmarks?: Array<string>;
  }  
  
  type PostProps = {
    user: UserProps;
    // post?: DocumentData;
    // newPost: DocumentData[];
    // setNewPost: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    update: undefined | boolean;
    setUpdate: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    name?: string;
}

const Repost: React.FC<PostProps> = ({}) => {
  return (
    <div>Repost</div>
  )
}

export default Repost