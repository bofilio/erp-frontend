import { Stack, IconButton, Toolbar, Typography, Avatar, Button, Box, InputBase } from '@mui/material'
import React, { useContext } from 'react'
import { AuthContext, CurrentAppContext } from '../../contexts';
import Link from 'next/link';
import { TopMenu as CourierTopMenu } from '../applications/couriers/navigation';
import { TopMenu as GrhTopMenu } from '../applications/grh/navigation';
import { ADMIN_URL } from '../../settings/constants';
import SearchIcon from '@mui/icons-material/Search';


export const NavBarContent = ({ handleDrawerToggle }: any) => {
    const { currentUser } = useContext(AuthContext)
    const { currentApp } = useContext(CurrentAppContext)
    return (
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 4 }}>
            <Stack spacing={3} direction="row" alignItems="center" flexGrow={1}>
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

            <Stack spacing={2} direction="row" alignItems="center">
                <Box
                    component="form"
                    sx={{ p: '2px', display: 'flex', alignItems: 'center', width: 400, backgroundColor: "#414e5c", borderRadius: 1 }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1, color: "white" }}
                        placeholder="Recherche"
                        inputProps={{ 'aria-label': 'search google maps' }}
                    />
                    <IconButton type="submit" sx={{ p: '10px', color: "white" }} aria-label="search">
                        <SearchIcon color="inherit" />
                    </IconButton>
                </Box>
                {currentUser &&
                    <Stack direction="row" alignItems="center" spacing={3}>
                        { currentUser.profile?.is_staff &&
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

                        <Link href='/auth/logout'>
                            <Button color="info" size="small">
                                Quiter
                            </Button>
                        </Link>
                    </Stack>
                }
            </Stack>


        </Toolbar>
    )
}
