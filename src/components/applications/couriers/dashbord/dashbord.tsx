import { Card, Grid } from '@mui/material'
import React from 'react'
import { Example } from './charts'

export const DashbordCouriers = () => {
    return (
        <Grid container spacing={2} padding={2}>
            <Grid item xs={8} >
                    <Example />
            </Grid>
            <Grid item xs={4}>
                    <Example />
            </Grid>
            <Grid item xs={4}>
                    <Example />
            </Grid>
            <Grid item xs={8}>
                    <Example />
            </Grid>
        </Grid>

    )
}

