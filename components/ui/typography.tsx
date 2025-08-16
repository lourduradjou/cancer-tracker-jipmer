import { clsx } from 'clsx'

type TypographyProps = {
    children: React.ReactNode
    className?: string
}

export function TypographyH1({ children, className }: TypographyProps) {
    return (
        <h1
            className={clsx(
                'scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance',
                className
            )}
        >
            {children}
        </h1>
    )
}

export function TypographyH2({ children, className }: TypographyProps) {
    return (
        <h2
            className={clsx(
                'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
                className
            )}
        >
            {children}
        </h2>
    )
}

export function TypographyH3({ children, className }: TypographyProps) {
    return (
        <h3 className={clsx('scroll-m-20 text-2xl font-semibold tracking-tight', className)}>
            {children}
        </h3>
    )
}

export function TypographyH4({ children, className }: TypographyProps) {
    return (
        <h4 className={clsx('scroll-m-20 text-xl font-semibold tracking-tight', className)}>
            {children}
        </h4>
    )
}

export function TypographyP({ children, className }: TypographyProps) {
    return (
        <p className={clsx('leading-7 font-light [&:not(:first-child)]:mt-6', className)}>
            {children}
        </p>
    )
}

export function TypographyBlockquote({ children, className }: TypographyProps) {
    return (
        <blockquote className={clsx('mt-6 border-l-2 pl-6 italic', className)}>
            {children}
        </blockquote>
    )
}

export function TypographyInlineCode({ children, className }: TypographyProps) {
    return (
        <code
            className={clsx(
                'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
                className
            )}
        >
            {children}
        </code>
    )
}

export function TypographyLead({ children, className }: TypographyProps) {
    return <p className={clsx('text-muted-foreground text-xl', className)}>{children}</p>
}

export function TypographyLarge({ children, className }: TypographyProps) {
    return <div className={clsx('text-lg font-semibold', className)}>{children}</div>
}

export function TypographySmall({ children, className }: TypographyProps) {
    return <small className={clsx('text-sm leading-none font-medium', className)}>{children}</small>
}

export function TypographyMuted({ children, className }: TypographyProps) {
    return <p className={clsx('text-md font-light', className)}>{children}</p>
}
