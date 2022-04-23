import { Stack, IconButton, Toolbar, Typography, Avatar, Button } from '@mui/material'
import React, { useContext } from 'react'
import { AuthContext } from '../../contexts';
import Link from 'next/link';

export const NavBarContent = ({ handleDrawerToggle }: any) => {
    const { currentUser } = useContext(AuthContext)

    return (
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Link href='/'>
                <a>
                    <Typography variant="button" noWrap component="div">
                        Accueil
                    </Typography>
                </a>
            </Link>

            {currentUser &&
                <Stack spacing={2} direction="row" alignItems="center">
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="button">
                            {currentUser.username}
                        </Typography>
                        <Avatar>

                        </Avatar>
                    </Stack>


                    <Link href='/auth/logout'>
                        <Button color="info" size="small">
                            Quiter
                        </Button>
                    </Link>
                </Stack>
            }
        </Toolbar>
    )
}
