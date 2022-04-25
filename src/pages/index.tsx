import { Box, Divider, Paper, Stack, Typography } from '@mui/material';
import type { NextPage } from 'next'
import { ApplicationCard } from '../components/content/common';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import Link from 'next/link';
import React,{ useEffect,useContext } from 'react';
import { CurrentAppContext } from '../contexts';



const Home: NextPage = () => {

  const { setCurrentApp } = useContext(CurrentAppContext)
  useEffect(()=>{
    setCurrentApp(null)
  },[])
  
  return (
    
      <Box sx={{ padding: 2 }}>
        <Typography variant="body1">
          Applications
        </Typography>
        <Stack
          sx={{ paddingY: 2, paddingX: 3 }}
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
        >
          {
            apps.map(app => (
              <Link href={app.indexUrl} key={app.name}>
                <a>
                  < ApplicationCard >
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                      {app.icon}
                      {app.name}
                    </Box>
                  </ApplicationCard>
                </a>

              </Link>

            ))
          }

        </Stack>
        <Divider />
      </Box>

   
  )
}
export default Home

type AppType = {
  name: string;
  icon: JSX.Element;
  indexUrl: string;
}
const apps: AppType[] = [
  {
    name: "Couries",
    icon: <SendOutlinedIcon color='primary' fontSize='large' />,
    indexUrl: "/couriers"
  },
  {
    name: "GRH",
    icon: <GroupAddOutlinedIcon color='primary' fontSize='large' />,
    indexUrl: "/grh"
  }
]