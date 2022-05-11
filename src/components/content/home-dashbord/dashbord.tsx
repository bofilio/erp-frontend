import { Card, Grid, Stack } from '@mui/material'
import React from 'react'
import { Example } from './charts'
import { Stat } from './charts/Stat'

export const HomeDashbord = () => {
    return (
        <Stack direction="column" alignItems="start">
            <Grid container spacing={2} padding={2}>
                <Grid item xs={2} >
                    <Stat title='Employés' value={300} compareToValue={250} />
                </Grid>
                <Grid item xs={2}>
                    <Stat title='Absences' value={1562} compareToValue={2000} />
                </Grid>
            </Grid>

            <Grid container spacing={2} padding={2}>
                <Grid item xs={4} >
                    <Example />
                </Grid>
                <Grid item xs={5}>
                    <Example />
                </Grid>
                <Grid item xs={3}>
                    <Example />
                </Grid>
            </Grid>
        </Stack>


    )
}