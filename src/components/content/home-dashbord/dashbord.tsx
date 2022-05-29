import { Card, Grid, Stack } from '@mui/material'
import React from 'react'
import { Example } from './charts'
import { Stat } from './charts/Stat'

export const HomeDashbord = () => {
    return (
        <Stack  alignItems="start">
            <Stack spacing={2} direction="row" flexWrap="wrap"   padding={2}>
                <Stat title='Employés' value={300} compareToValue={250} />
                <Stat title='Absences' value={1562} compareToValue={2000} />
            </Stack>

            <Grid container spacing={2} padding={2}>
                <Grid item xs={12} md={6} lg={4} >
                    <Example />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <Example />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <Example />
                </Grid>
            </Grid>
        </Stack>


    )
}