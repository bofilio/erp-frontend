import { Button, IconButton, Toolbar, Typography } from '@mui/material'
import React, { useContext } from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from '../../contexts';
import Link from 'next/link';

export const NavBarContent = ({ handleDrawerToggle }: any) => {
    const { currentUser } = useContext(AuthContext)

    return (
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Link href='/'>
                <a>
                    <Typography variant="button" noWrap component="div">
                        Home
                    </Typography>
                </a>
            </Link>

            {
                currentUser ?
                    <Link href='/auth/logout'>
                        <a>
                            <Typography variant="button" noWrap component="span">
                                Logout
                            </Typography>
                        </a>
                    </Link>
                    :
                    <Link href='/auth/login'>
                        <a>
                            <Typography variant="button" noWrap component="span">
                                Login
                            </Typography>
                        </a>

                    </Link>

            }
        </Toolbar>
    )
}
