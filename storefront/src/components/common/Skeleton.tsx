import styles from './Skeleton.module.css';

interface SkeletonProps {
    className?: string;
    style?: React.CSSProperties;
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
}

export default function Skeleton({ className, style, width, height, borderRadius }: SkeletonProps) {
    const customStyle = {
        width,
        height,
        borderRadius,
        ...style,
    };

    return <div className={`${styles.skeleton} ${className || ''}`} style={customStyle} />;
}
