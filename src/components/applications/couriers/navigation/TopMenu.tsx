import { Typography } from '@mui/material'
import Link from 'next/link'
import React from 'react'

export const TopMenu = () => {
    return (
        <Link href='/couriers/dashbord'>
            <a>
                <Typography variant="button" noWrap component="div">
                    DashBord
                </Typography>
            </a>
        </Link>
    )
}
