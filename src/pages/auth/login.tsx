import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MuiLink from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next'
import Link from 'next/link';
import { useAuth } from '../../hooks/auth';
import { AlertContext, AuthContext, LoadingContext, USER_KEY } from '../../contexts';
import { useRouter } from 'next/router';



const Login: NextPage = () => {
    const { authState, dispatch } = useAuth()
    const { setLoading } = React.useContext(LoadingContext)
    const { setAlert } = React.useContext(AlertContext)
    const { isLoading, data, error } = authState
    React.useEffect(() => {
        setLoading(isLoading)
        if (error !== null) setAlert({ status: "error", message: "username ou mot de pass n'est pas correct!" })
    }, [isLoading, error])

    const { currentUser } = React.useContext(AuthContext)
    const router=useRouter()

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form_data = new FormData(event.currentTarget);
        dispatch({ type: "LOGIN", payload: { username: form_data.get("username"), password: form_data.get('password') } })
    };
    React.useEffect(() => {
        if(currentUser!=null) router.push("/")
    },[currentUser])
    return (
        <>
            {
                currentUser === null && <Grid container component="main" sx={{ height: '100vh' }}>
                    <CssBaseline />
                    <Grid
                        item
                        xs={false}
                        sm={4}
                        md={7}
                        sx={{
                            backgroundImage: 'url(/imgs/hugar.webp)',
                            backgroundRepeat: 'no-repeat',
                            backgroundColor: (t) =>
                                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                        <Box
                            sx={{
                                my: 8,
                                mx: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Log in
                            </Typography>
                            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                    autoFocus
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Mot de pass"
                                    type="password"
                                    id="password"
                                    autoComplete="password"
                                />
                                <FormControlLabel
                                    control={<Checkbox checked value="remember" color="primary" />}
                                    label="Rappeler moi"
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Login
                                </Button>
                                <Grid container>
                                    <Grid item xs>
                                        <Link href="#" >
                                            <MuiLink variant="body2">{"Mot de pass oublié?"}</MuiLink>
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <span></span>
                                        <Link href="#" >
                                            <MuiLink variant="body2">
                                                {"Vous n'avez pas de compte?"}
                                            </MuiLink>

                                        </Link>
                                    </Grid>
                                </Grid>

                            </Box>
                        </Box>
                    </Grid>
                </Grid>

            }

        </>

    );
}

export default Login