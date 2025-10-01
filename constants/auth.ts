export const ROLE_REDIRECTS = {
    nurse: '/PuduCan/nurse',
    doctor: '/PuduCan/doctor',
    asha: '/PuduCan/asha',
    admin: '/PuduCan/admin',
} as const

type Role = keyof typeof ROLE_REDIRECTS

export const ROLE_CONFIG: Record<
    Role,
    {
        allowedRoles: Role[]
        redirectMap: typeof ROLE_REDIRECTS
    }
> = {
    nurse: {
        allowedRoles: ['nurse'],
        redirectMap: ROLE_REDIRECTS,
    },
    doctor: {
        allowedRoles: ['doctor'],
        redirectMap: ROLE_REDIRECTS,
    },
    asha: {
        allowedRoles: ['asha'],
        redirectMap: ROLE_REDIRECTS,
    },
    admin: {
        allowedRoles: ['admin'],
        redirectMap: ROLE_REDIRECTS,
    },
}
