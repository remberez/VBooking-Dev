import React, { useState } from 'react';
import styles from './AvatarUpload.module.css';

const AvatarUpload = ({ onImageUpload, circleClassName }) => {
    const [preview, setPreview] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                if (onImageUpload) {
                    onImageUpload(file);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <label className={`${styles.uploadLabel} ${circleClassName}`}>
                {preview ? (
                    <img
                        src={preview}
                        alt="Загруженное фото"
                        className={styles.avatar}
                    />
                ) : (
                    <div className={`${styles.placeholder}`}>
                        <span className={styles.placeholderText}>+</span>
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={styles.inputFile}
                />
            </label>
        </>
    );
};

export default AvatarUpload;