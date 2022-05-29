import { Box, Divider, IconButton, InputBase, Paper } from '@mui/material'
import React from 'react'
import SearchIcon from '@mui/icons-material/Search';

type filterHeaderProps={
    updateSearch:(val:string)=>void
}

export const FilterHeader:React.FC<filterHeaderProps> = (props) => {
    const { updateSearch}=props
    return (
       
            <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "100%" }}
            >
                <Box sx={{ width: '100%', display: "flex", justifyContent: "space-between" }}>
                    <InputBase
                        sx={{ ml: 1, flex: 1,  }}
                        placeholder="Recherche par: objet, type, N°enr ou ref_exp"
                        onChange={(e) => {
                            const START_SEARCH_AT = 2
                            const val = e.target.value
                            if (val.length >= START_SEARCH_AT) {
                                updateSearch(val)
                                return
                            }
                            updateSearch("")
                        }}
                    />
                    <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Box>

                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            </Paper>
            )
}
