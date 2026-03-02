'use client';

import styles from './Button.module.css';

/**
 * Button Component
 * Touch-friendly, accessible button with variants
 * 
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'outline' | 'danger'} props.variant - Button style variant
 * @param {'sm' | 'md' | 'lg'} props.size - Button size
 * @param {boolean} props.isLoading - Show loading spinner
 * @param {boolean} props.disabled - Disable button
 * @param {boolean} props.fullWidth - Full width button
 * @param {React.ReactNode} props.children - Button content
 */
export default function Button({
    children,
    variant = 'primary',
    size = 'lg',
    isLoading = false,
    disabled = false,
    fullWidth = false,
    type = 'button',
    onClick,
    ariaLabel,
    className = '',
    ...props
}) {
    const classNames = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : '',
        isLoading ? styles.loading : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={classNames}
            disabled={disabled || isLoading}
            onClick={onClick}
            aria-label={ariaLabel}
            aria-busy={isLoading}
            {...props}
        >
            {isLoading ? (
                <span className={styles.spinner} aria-hidden="true" />
            ) : null}
            <span className={`${styles.content} ${isLoading ? styles.hiddenText : ''}`}>
                {children}
            </span>
        </button>
    );
}
