import React from 'react';
import { motion } from 'motion/react';
import './Title.css';
const Title = ({ title, subTitle }) => {
    return (
        <div className='title-section'>
            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className='title'
            >
                {title}
            </motion.h2>
            {subTitle && (
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className='subtitle'
                >
                    {subTitle}
                </motion.p>
            )}
        </div>
    );
};
export default Title;