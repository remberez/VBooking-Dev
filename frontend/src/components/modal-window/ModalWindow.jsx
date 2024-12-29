import TransparentButton from "../../UI/transparent-button/TransparentButton";
import classes from "./ModalWindow.module.css";
import React, { useEffect } from 'react';

function ModalWindow({ isOpen, onClose, children }) {
    useEffect(() => {
        if (isOpen) {
          document.body.classList.add('no-scroll');
        } else {
          document.body.classList.remove('no-scroll');
        }
    
        return () => {
          document.body.classList.remove('no-scroll'); 
        };
      }, [isOpen]);
    
      if (!isOpen) return null;

    return (
        <div className={classes.modalContainer}>
            <div className={classes.modalWindow}>
                  <TransparentButton onClick={onClose} className={classes.closeButton} />
                <div className={classes.modalContent}>
                    { children }
                </div>
            </div>
        </div>
    )
}

export default ModalWindow;