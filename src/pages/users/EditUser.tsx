import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { doc, getDoc, updateDoc, serverTimestamp, FieldValue } from 'firebase/firestore';
import { db } from 'lib/firebase';
import { useAuth } from 'providers/AuthProvider';
import paths from 'routes/paths';
import PageHeader from 'components/sections/user-table/PageHeader';

import { User } from 'types/users';
import { Grid } from '@mui/material';
import FormUser from 'components/sections/FormUser';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const EditUser = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const methods = useForm<User>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      location: '',
      birthday: '',
      profession: '',
      status: '',
    },
    mode: 'onChange',
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        navigate(paths.users);
        return;
      }

      try {
        setLoading(true);
        const userDoc = await getDoc(doc(db, 'users', id));
        
        if (!userDoc.exists()) {
          setError('Usuário não encontrado');
          setTimeout(() => {
            navigate(paths.users);
          }, 2000);
          return;
        }

        const userData = userDoc.data() as Omit<User, 'id'>;

        if (user && userData.physiotherapistId !== user.uid) {
          setError('Você não tem permissão para editar este paciente.');
          setTimeout(() => {
            navigate(paths.users);
          }, 2000);
          return;
        }
        
        reset({
          ...userData,
        } as User);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Erro ao carregar usuário');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate, reset]);

  const handleBack = () => {
    navigate(paths.users);
  };

  const onSubmit = async (data: User) => {
    if (!id) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const { id: _, deletedAt: __, ...userForm } = data;
      
      await updateDoc(doc(db, 'users', id), {
        ...userForm,
        updatedAt: serverTimestamp(),
      } as Omit<User, 'id' | 'deletedAt'> & { updatedAt: FieldValue });

      setSuccess(true);
      console.log('User updated successfully in Firestore');

      setTimeout(() => {
        navigate(paths.users);
      }, 1000);
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Erro ao atualizar usuário. Verifique sua conexão e tente novamente.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <FormProvider {...methods}>
      <Stack direction="column" height={1}>
        <PageHeader
          title="Editar Paciente"
          breadcrumb={[
            { label: 'Início', url: paths.root },
            { label: 'Pacientes', url: paths.users },
            { label: 'Editar Paciente', active: true },
          ]}
        />
        <Paper sx={{ flex: 1, p: { xs: 3, md: 5 } }}>
          <Stack spacing={4}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <FormUser />
              </Grid>
              <Grid size={12}>
                <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
                  <Button onClick={handleBack}>
                    Voltar
                  </Button>
                  <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                    Atualizar
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Paper>
      </Stack>
    </FormProvider>
  );
};

export default EditUser;

