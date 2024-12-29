import React, { useEffect, useRef } from 'react';
import { gsap } from "gsap";
import styles from './NotFound.module.css';

const NotFound = () => {
  const textRef = useRef(null);

  useEffect(() => {
    const text = textRef.current;

    if (text) {
      // Simple animation without getTotalLength
      gsap.fromTo(text, {
        strokeDasharray: 600, // Initial stroke dash array length (roughly enough to cover the text)
        strokeDashoffset: 600,
      }, {
        strokeDashoffset: 0, // Animate the offset to 0
        duration: 10,
        delay: 0.5,
        ease: 'power1.out',
      });
    }
  }, []);

  return (
    <div className={styles.notFoundContainer}>
        <svg
            className={styles.svg404}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 400 150"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
        >
            <text
                ref={textRef}
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize="100"
                className={`digit ${styles.digit}`}
                fill="none"
                stroke="#fff"
            >
                404
            </text>
        </svg>
      <p className={styles.message}>Кажется, вы потерялись...</p>
    </div>
  );
};

export default NotFound;
