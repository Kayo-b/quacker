import React from 'react'
import { DocumentData } from 'firebase/firestore';
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
}

//Modal for the comment popup
function Modal({ isOpen, onClose, children}: ModalProps) {
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

const Comment: React.FC<PostProps> = ({user, post, name, setUpdate, update, newPost, setNewPost}) => {
    
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

  return (
    <div>
        <button onClick={openModal}>Comment</button>
        <Modal isOpen={isModalOpen} onClose={closeModal}>   
            {<CreatePost 
            user={user}
            post={post}
            setUpdate={setUpdate}
            setNewPost={setNewPost}
            newPost={newPost}
            update={update}
            name={name}
            
            />}
        </Modal>
        
    </div>
  )
}

export default Comment