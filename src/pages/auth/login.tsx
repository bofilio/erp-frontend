import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { TextField } from '@mui/material';
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
import { parseErrorString } from '../../helpers';
import * as Yup from 'yup';
import { useFormik } from 'formik';


const validationSchema = Yup.object({
    username: Yup.string().required("Svp, saisissez votre nom d'utilisateur "),
    password: Yup.string().required("Svp, saisissez votre mot de pass ").min(6, "Le mot de pass ne doit pas etre moins de six caractéres"),
});
type LoginFormType = {
    username: string,
    password: string,
}

const Login: NextPage = () => {
    const { authState, dispatch } = useAuth()
    const { setLoading } = React.useContext(LoadingContext)
    const { setAlert } = React.useContext(AlertContext)
    const { isLoading, data, error } = authState

    const formik = useFormik<LoginFormType>({
        initialValues: {
            username: "",
            password: ""
        },
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: (values: LoginFormType) => {
            dispatch({ type: "LOGIN", payload: { username: values.username, password: values.password } })
        },
    });

    React.useEffect(() => {
        setLoading(isLoading)
        if (error !== null) setAlert({ status: "error", message: parseErrorString(error) })
    }, [isLoading, error])

    const { currentUser } = React.useContext(AuthContext)
    const router = useRouter()

    React.useEffect(() => {
        if (currentUser != null) router.push("/")
    }, [currentUser])

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
                                S'identifier
                            </Typography>
                            <form onSubmit={formik.handleSubmit} style={{ maxWidth: "512px" }}>

                                <TextField
                                    margin="normal"
                                    fullWidth
                                    id="username"
                                    label="Nom d'utilisateur"
                                    name="username"
                                    autoFocus
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    error={formik.touched.username && Boolean(formik.errors.username)}
                                    helperText={formik.touched.username && formik.errors.username}

                                />
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    name="password"
                                    label="Mot de pass"
                                    type="password"
                                    id="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                />
                                {/*<FormControlLabel
                                    control={<Checkbox checked value="remember" color="primary" />}
                                    label="Rappeler moi"
                                />*/}
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


                            </form>

                        </Box>
                    </Grid>
                </Grid>

            }

        </>

    );
}

export default Login