import { Stack, IconButton, Toolbar, Typography, Avatar, Button } from '@mui/material'
import React, { useContext } from 'react'
import { AuthContext, CurrentAppContext } from '../../contexts';
import Link from 'next/link';
import { TopMenu as CourierTopMenu } from '../applications/couriers/navigation';
import { TopMenu as GrhTopMenu } from '../applications/grh/navigation';
import { ADMIN_URL } from '../../settings/constants';

export const NavBarContent = ({ handleDrawerToggle }: any) => {
    const { currentUser } = useContext(AuthContext)
    const { currentApp } = useContext(CurrentAppContext)
    return (
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Stack spacing={3} direction="row">
                <Link href='/'>
                    <a>
                        <Typography variant="button" noWrap component="div">
                            Accueil
                        </Typography>
                    </a>
                </Link>
                {currentApp === "couriers" &&
                    <CourierTopMenu />
                }
                {currentApp === "grh" &&
                    <GrhTopMenu />
                }

            </Stack>
            {currentUser &&
                <Stack spacing={2} direction="row" alignItems="center">
                    <Stack direction="row" alignItems="center" spacing={3}>
                        {
                            <Typography variant="button">
                                <a href={ADMIN_URL} target="_blank">
                                    Administration
                                </a>
                            </Typography>
                        }
                        <Typography variant="button">
                            {currentUser.username}
                        </Typography>
                        <Avatar />
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
