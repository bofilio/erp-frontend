import { styled } from '@mui/material/styles';
import { Box, Divider, Paper, Stack } from '@mui/material';
import React from 'react'


const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  width:theme.spacing(12),
  color: theme.palette.text.secondary,
  '&:hover': {
    transform: 'scale(1.05)'
 },
}));

export const ApplicationCard:React.FC<{}> = (props) => {
    const {children}=props
  return (
    <Item>{children}</Item>
  )
}
