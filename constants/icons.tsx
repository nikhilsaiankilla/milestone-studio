type IconProps = {
    size?: number
    className?: string
    strokeWidth?: number
    style?: React.CSSProperties
}

export const ICONS = {
    x: ({ size = 14, className, strokeWidth, style }: IconProps) => (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            width={size}
            height={size}
            className={className}
            strokeWidth={strokeWidth}
            style={style}
        >
            <path d="M18.244 2H21l-6.56 7.5L22 22h-6.828l-5.35-6.993L3.5 22H1l7.02-8.02L2 2h6.828l4.84 6.33L18.244 2Zm-2.394 18h1.885L8.16 4H6.155l9.695 16Z" />
        </svg>
    ),

    instagram: ({ size = 14, className, strokeWidth, style }: IconProps) => (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            width={size}
            height={size}
            className={className}
            strokeWidth={strokeWidth}
            style={style}
        >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
        </svg>
    ),

    linkedin: ({ size = 14, className, strokeWidth, style }: IconProps) => (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            width={size}
            height={size}
            className={className}
            strokeWidth={strokeWidth}
            style={style}
        >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    ),

    youtube: ({ size = 14, className, strokeWidth, style }: IconProps) => (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            width={size}
            height={size}
            className={className}
            strokeWidth={strokeWidth}
            style={style}
        >
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
    ),

    producthunt: ({ size = 14, className, strokeWidth, style }: IconProps) => (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            width={size}
            height={size}
            className={className}
            strokeWidth={strokeWidth}
            style={style}
        >
            <path d="M13.604 8.4h-3.405V12h3.405a1.8 1.8 0 0 0 0-3.6zM12 0C5.373 0 0 5.372 0 12s5.373 12 12 12 12-5.372 12-12S18.627 0 12 0zm1.604 14.4H10.2V18H7.8V6h5.804a4.2 4.2 0 0 1 0 8.4z" />
        </svg>
    ),

    github: ({ size = 14, className, strokeWidth, style }: IconProps) => (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            width={size}
            height={size}
            className={className}
            strokeWidth={strokeWidth}
            style={style}
        >
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
    ),

    // Fixed: was using a broken mixed-format path. Now uses the clean standard Medium wordmark icon.
    medium: ({ size = 14, className, strokeWidth, style }: IconProps) => (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            width={size}
            height={size}
            className={className}
            strokeWidth={strokeWidth}
            style={style}
        >
            <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
        </svg>
    ),
}


export const METRIC_ICON = {
    users: ({ size = 14, className, strokeWidth, style }: IconProps) => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            width={size}
            height={size}
            className={className}
            strokeWidth={strokeWidth ?? 2}
            style={style}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M12 15C8.8299 15 6.01077 16.5306 4.21597 18.906C3.82968 19.4172 3.63653 19.6728 3.64285 20.0183C3.64773 20.2852 3.81533 20.6219 4.02534 20.7867C4.29716 21 4.67384 21 5.4272 21H18.5727C19.3261 21 19.7028 21 19.9746 20.7867C20.1846 20.6219 20.3522 20.2852 20.3571 20.0183C20.3634 19.6728 20.1703 19.4172 19.784 18.906C17.9892 16.5306 15.17 15 12 15Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 12C14.4853 12 16.5 9.98528 16.5 7.5C16.5 5.01472 14.4853 3 12 3C9.51469 3 7.49997 5.01472 7.49997 7.5C7.49997 9.98528 9.51469 12 12 12Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),

    growth: ({ size = 14, className, strokeWidth, style }: IconProps) => (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            width={size}
            height={size}
            className={className}
            strokeWidth={strokeWidth}
            style={style}
        >
            <path d="M3 17l6-6 4 4 7-7v4h2V4h-8v2h4.59L13 13l-4-4-7 7z" />
        </svg>
    ),

    // Fixed: replaced rough non-standard path with a clean symmetric heart using cubic bezier curves
    likes: ({ size = 14, className, strokeWidth, style }: IconProps) => (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            width={size}
            height={size}
            className={className}
            strokeWidth={strokeWidth}
            style={style}
        >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35z" />
        </svg>
    ),

    // Fixed: much cleaner eye shape with proper iris/pupil
    views: ({ size = 14, className, strokeWidth, style }: IconProps) => (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            width={size}
            height={size}
            className={className}
            strokeWidth={strokeWidth}
            style={style}
        >
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
        </svg>
    ),

    comments: ({ size = 14, className, strokeWidth, style }: IconProps) => (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            width={size}
            height={size}
            className={className}
            strokeWidth={strokeWidth}
            style={style}
        >
            <path d="M21 6h-18v12h4v4l4-4h10z" />
        </svg>
    ),

    shares: ({ size = 14, className, strokeWidth, style }: IconProps) => (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            width={size}
            height={size}
            className={className}
            strokeWidth={strokeWidth}
            style={style}
        >
            <path d="M18 16a3 3 0 0 0-2.24 1.02L8.91 13.7a3.1 3.1 0 0 0 0-1.39l6.85-3.32A3 3 0 1 0 15 7a2.9 2.9 0 0 0 .09.7L8.24 11A3 3 0 1 0 9 14a2.9 2.9 0 0 0-.09-.7l6.85 3.32A3 3 0 1 0 18 16z" />
        </svg>
    ),

    // Fixed: replaced uneven star path with a proper 5-pointed star using precise geometry
    stars: ({ size = 14, className, strokeWidth, style }: IconProps) => (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            width={size}
            height={size}
            className={className}
            strokeWidth={strokeWidth}
            style={style}
        >
            <path d="M12 2l2.939 6.441L22 9.309l-5.354 5.07 1.388 7.621L12 18.354l-6.034 3.646 1.388-7.621L2 9.309l7.061-.868z" />
        </svg>
    ),
} as const