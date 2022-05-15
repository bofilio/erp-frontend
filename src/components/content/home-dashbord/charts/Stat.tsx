import { Box } from '@mui/material'
import React from 'react'
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';


type StatProps = {
    title: string
    value: number
    compareToValue: number
}
export const Stat: React.FC<StatProps> = (props) => {
    const { title, value, compareToValue } = props
    
    const calcPercentage = () => {
        return Math.floor((value - compareToValue) / value * 100)+"%"
    }
    const formatValue=(val:number)=>{
        if (val<1000) return val
        if (val<1000000) return (val/1000)+"K"
        return (val/1000000)+"M"
    }
    return (
        <Box
            sx={{
                bgcolor: 'background.paper',
                boxShadow: 1,
                borderRadius: 1,
                p: 2,
                borderLeft:1,
                borderColor: value > compareToValue ? 'success.dark' : 'error.dark',
                borderWidth:3
            }}
        >
            <Box sx={{ color: 'text.secondary' }}>{title}</Box>
            <Box sx={{ color: 'text.primary', fontSize: 34, fontWeight: 'medium' }}>
                {formatValue(value)}
            </Box>
            <Box
                component={value > compareToValue ? TrendingUpIcon : TrendingDownIcon}
                sx={{ color: value > compareToValue ? 'success.dark' : 'error.dark', fontSize: 16, verticalAlign: 'sub' }}
            />
            <Box
                sx={{
                    color: value > compareToValue ? 'success.dark' : 'error.dark',
                    display: 'inline',
                    fontWeight: 'medium',
                    mx: 0.5,
                }}
            >
                {calcPercentage()}
            </Box>
            <Box sx={{ color: 'text.secondary', display: 'inline', fontSize: 12 }}>
                vs. Annee dernière
            </Box>
        </Box>
    )
}



function round(value:number,offset:number){
    return Math.round(value*100)/100
}