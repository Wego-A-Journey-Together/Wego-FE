'use client';

import { motion } from 'motion/react';

/** #P101 성능: 정적 애니메이션 설정은 컴포넌트 외부로 이동 필요 */
export default function LoadingThreeDots() {
    const dotVariants = {
        pulse: {
            scale: [1, 1.5, 1],
            transition: {
                duration: 0.8,
                repeat: Infinity,
                ease: 'easeInOut',
            },
        },
    };

    /** #A102 접근성: 로딩 상태를 스크린 리더에 알리기 위한 ARIA 속성 추가 필요 */
    return (
        <motion.div
            animate="pulse"
            transition={{ staggerChildren: -0.2, staggerDirection: -1 }}
            className="container"
        >
            <motion.div className="dot" variants={dotVariants} />
            <motion.div className="dot" variants={dotVariants} />
            <motion.div className="dot" variants={dotVariants} />
            <StyleSheet />
        </motion.div>
    );
}

/**
 * ==============   Styles   ================
 */
/** #P103 성능: 스타일시트를 외부 CSS 파일로 분리하여 캐싱 활용 필요 */
function StyleSheet() {
    return (
        <style>
            {`
            .container {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 8px;
            }

            .dot {
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background-color: #0AC7E4;
                will-change: transform;
            }
            `}
        </style>
    );
}
