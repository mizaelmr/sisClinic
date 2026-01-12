import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import paths from 'routes/paths';
import { auth } from 'lib/firebase';
import PasswordTextField from 'components/common/PasswordTextField';
import SocialAuth from './SocialAuth';

interface LoginFormProps {
  defaultCredential?: { email: string; password: string };
}
const LoginForm = ({ defaultCredential }: LoginFormProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (rememberMe) {
        await setPersistence(auth, browserLocalPersistence);
      } else {
        await setPersistence(auth, browserSessionPersistence);
      }
      
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      let errorMessage = 'Erro ao fazer login. Tente novamente.';
      
      if (err.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido.';
      } else if (err.code === 'auth/user-disabled') {
        errorMessage = 'Usuário desabilitado.';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Senha incorreta.';
      } else if (err.code === 'auth/invalid-credential') {
        errorMessage = 'Credenciais inválidas.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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
            <Typography variant="h4">Entrar</Typography>
            <Typography
              variant="subtitle2"
              sx={{
                color: 'text.secondary',
              }}
            >
              Não tem uma conta?
              <Link href={paths.signup} sx={{ ml: 1 }}>
                Cadastrar
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
              <Grid
                sx={{
                  mb: 3,
                }}
                size={12}
              >
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
                />
              </Grid>
              <Grid
                sx={{
                  mb: 2.5,
                }}
                size={12}
              >
                <PasswordTextField
                  fullWidth
                  size="large"
                  id="password"
                  label="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </Grid>
              <Grid
                sx={{
                  mb: 6,
                }}
                size={12}
              >
                <Stack
                  spacing={1}
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox 
                        name="rememberMe" 
                        color="primary" 
                        size="small"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                    }
                    label={
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: 'text.secondary',
                        }}
                      >
                        Lembrar deste dispositivo
                      </Typography>
                    }
                  />

                  <Link href={paths.forgotPassword} variant="subtitle2">
                    Esqueceu a senha?
                  </Link>
                </Stack>
              </Grid>
              <Grid size={12}>
                <Button 
                  fullWidth 
                  type="submit" 
                  size="large" 
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginForm;
