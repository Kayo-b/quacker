import React from 'react'
import { DocumentData } from 'firebase/firestore';
import { VscComment } from 'react-icons/vsc';
import CreatePost from './CreatePost';
import { setUncaughtExceptionCaptureCallback } from 'process';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

type UserProps = {
    authProvider?: string;
    email: string;
    name?: string;
    uid: string;
    bookmarks?: Array<string>;
  }  
  
  type PostProps = {
    user: UserProps;
    post?: DocumentData;
    newPost: DocumentData[];
    setNewPost: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    update: undefined | boolean;
    setUpdate: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    name?: string;
    userData?: DocumentData;
    userImg?: string;
}
console.log("comment")
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

const Comment: React.FC<PostProps> = ({user, post, name, setUpdate, update, newPost, setNewPost, userData, userImg}) => {
    
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
  console.log(userData,"USER DATA COMMENT")
  return (
    <div className="comment-btn">
        <VscComment onClick={openModal}/>
       
          <Modal isOpen={isModalOpen} onClose={closeModal}>   
          <div className={"modal-frame"}>
              {<CreatePost 
              user={user}
              post={post}
              setUpdate={setUpdate}
              setNewPost={setNewPost}
              newPost={newPost}
              update={update}
              name={name}
              userData={userData}
              userImg={userImg}
              />}
          </div>
          </Modal>

       
        
    </div>
  )
}

export default Comment