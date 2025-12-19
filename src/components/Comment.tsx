import React from 'react'
import { DocumentData } from 'firebase/firestore';
import { VscComment } from 'react-icons/vsc';
import CreatePost from './CreatePost';
import { MdClose } from "react-icons/md";
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
let handleModalClick = (e: React.MouseEvent) => {
  e.stopPropagation();
} 

//Modal for the comment popup
function Modal({ isOpen, onClose, children }: ModalProps) {
    if (!isOpen) return null;
  
    return (
      <div className="modal-container-comment-wrapper">
      <div className="modal-container-comment">
        <div className="modal" onClick={e => handleModalClick(e)}>
          <div className="modal-content">
            <button className="close-button" onClick={onClose}>
              <MdClose style={{height:'15px', width:'15px'}}/>
            </button>
            {children}
          </div>
        </div>
      </div>
      </div>
    );
  }

const Comment: React.FC<PostProps> = ({user, post, name, setUpdate, update, newPost, setNewPost, userData, userImg}) => {
    
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const openModal = (e: React.MouseEvent) => {e.stopPropagation();setIsModalOpen(true)};
    const closeModal = () => setIsModalOpen(false);
  return (
    <div className="comment-btn" data-testid="comment-button-container">
        <VscComment onClick={e => openModal(e)} data-testid="comment-button"/>
       
          <Modal isOpen={isModalOpen} onClose={closeModal}>   
            
              <div className={"modal-frame"} data-testid="comment-modal">
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
                  closeModal={closeModal}
                  />}
              </div>
              <div className="modal-faded-background" onClick={closeModal}></div>
            
          </Modal>

       
        
    </div>
  )
}

export default Comment