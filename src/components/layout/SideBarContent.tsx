import { Box, Divider, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material'
import React from 'react'
import MailIcon from '@mui/icons-material/Mail';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import Image from "next/image"
import Link from 'next/link';


export const SideBarContent = () => {
    return (

        <div>
            <Box sx={{ padding: 1 }}>
                <Link href="/">
                    <a>
                         <Image src="/imgs/logo.svg" height={64} width={240} />
                    </a>  
                </Link>
            </Box>

            <Divider />
           
        </div>


    )
}
