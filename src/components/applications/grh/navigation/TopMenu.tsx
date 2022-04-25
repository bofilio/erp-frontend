import { Typography } from '@mui/material'
import Link from 'next/link'
import React from 'react'

export const TopMenu = () => {
    return (
        <>
            <Link href='/grh/employe'>
                <a>
                    <Typography variant="button" noWrap component="div">
                        Employes
                    </Typography>
                </a>
            </Link>
            <Link href='/grh/structure'>
                <a>
                    <Typography variant="button" noWrap component="div">
                        Structure
                    </Typography>
                </a>
            </Link>
        </>

    )
}
