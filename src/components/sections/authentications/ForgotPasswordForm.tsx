import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import {
    Alert,
    Box,
    Button,
    Link,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import paths from 'routes/paths';
import { auth } from 'lib/firebase';

// FORMULÁRIO DE RECUPERAÇÃO DE SENHA
const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            setSuccess(true);
        } catch (err: any) {
            let errorMessage = 'Erro ao enviar email de recuperação. Tente novamente.';

            if (err.code === 'auth/invalid-email') {
                errorMessage = 'Email inválido.';
            } else if (err.code === 'auth/user-not-found') {
                errorMessage = 'Usuário não encontrado com este email.';
            } else if (err.code === 'auth/too-many-requests') {
                errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Stack
                direction="column"
                sx={{
                    height: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    pt: { md: 10 },
                    pb: 10,
                }}
            >
                <Grid
                    container
                    sx={{
                        maxWidth: '35rem',
                        rowGap: 4,
                        p: { xs: 3, sm: 5 },
                        mb: 5,
                    }}
                >
                    <Grid size={12}>
                        <Alert severity="success" sx={{ mb: 3 }}>
                            Email de recuperação enviado! Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                        </Alert>
                        <Link href={paths.login} sx={{ textDecoration: 'none' }}>
                            <Button fullWidth variant="contained" size="large">
                                Voltar para o Login
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
            </Stack>
        );
    }

    return (
        <Stack
            direction="column"
            sx={{
                height: 1,
                alignItems: 'center',
                justifyContent: 'space-between',
                pt: { md: 10 },
                pb: 10,
            }}
        >
            <div />

            <Grid
                container
                sx={{
                    maxWidth: '35rem',
                    rowGap: 4,
                    p: { xs: 3, sm: 5 },
                    mb: 5,
                }}
            >
                <Grid size={12}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1}
                        sx={{
                            justifyContent: 'space-between',
                            alignItems: { xs: 'flex-start', sm: 'flex-end' },
                        }}
                    >
                        <Typography variant="h4">Esqueci minha senha</Typography>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                color: 'text.secondary',
                            }}
                        >
                            Lembrou a senha?
                            <Link href={paths.login} sx={{ ml: 1 }}>
                                Entrar
                            </Link>
                        </Typography>
                    </Stack>
                </Grid>

                <Grid size={12}>
                    <Box component="form" noValidate onSubmit={handleSubmit}>
                        <Grid container>
                            {error && (
                                <Grid size={12} sx={{ mb: 2 }}>
                                    <Alert severity="error">{error}</Alert>
                                </Grid>
                            )}

                            <Grid size={12} sx={{ mb: 3 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Digite seu email e enviaremos um link para redefinir sua senha.
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="large"
                                    id="email"
                                    type="email"
                                    label="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                    autoFocus
                                />
                            </Grid>

                            <Grid size={12}>
                                <Button
                                    fullWidth
                                    type="submit"
                                    size="large"
                                    variant="contained"
                                    disabled={loading || !email}
                                >
                                    {loading ? 'Enviando...' : 'Enviar link de recuperação'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>

            <Link href={paths.login} variant="subtitle2">
                Voltar para o login
            </Link>
        </Stack>
    );
};

export default ForgotPasswordForm;
