import { Box, Divider, IconButton, InputBase, Paper, Stack, Typography } from '@mui/material'
import Link from 'next/link'
import React from 'react'


export const TopMenu = () => {
    return (
        <Stack direction="row" alignItems="center" spacing={3} justifyContent="space-between" flexGrow={1}>
            <Stack spacing={3} alignItems='center' direction="row">
                <Link href='/couriers' >
                    <a>
                        <Typography variant="button" noWrap component="div">
                            Couriers
                        </Typography>
                    </a>
                </Link>
                <Link href='/couriers/dashbord'>
                    <a>
                        <Typography variant="button" noWrap component="div">
                            DashBord
                        </Typography>
                    </a>
                </Link>
            </Stack>
        </Stack>

    )
}
