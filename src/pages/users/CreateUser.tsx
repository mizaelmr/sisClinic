import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { doc, setDoc, serverTimestamp, FieldValue } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { db } from 'lib/firebase';
import { useAuth } from 'providers/AuthProvider';
import paths from 'routes/paths';
import PageHeader from 'components/sections/user-table/PageHeader';

import { User } from 'types/users';
import { Grid } from '@mui/material';
import FormUser from 'components/sections/FormUser';

// PÁGINA DE CRIAÇÃO DE PACIENTE
const CreateUser = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const methods = useForm<User>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      location: '',
      birthday: '',
      status: 'active',
    },
    mode: 'onChange',
  });

  const { handleSubmit } = methods;

  const handleBack = () => {
    navigate(paths.users);
  };

  const onSubmit = async (data: User) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      if (!user) {
        setError('Você precisa estar logado para criar um paciente.');
        setIsSubmitting(false);
        return;
      }

      const id = uuidv4();

      const userForm: Omit<User, 'createdAt' | 'updatedAt'> & { createdAt: FieldValue; updatedAt: FieldValue; physiotherapistId: string } = {
        ...data,
        physiotherapistId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', id), userForm);

      setSuccess(true);
      console.log('User saved successfully in Firestore');

      setTimeout(() => {
        navigate(paths.users);
      }, 1000);
    } catch (err) {
      console.error('Error saving user:', err);
      setError('Erro ao salvar usuário. Verifique sua conexão e tente novamente.');
      setIsSubmitting(false);
    }
  };


  return (
    <FormProvider {...methods}>
      <Stack direction="column" height={1}>
        <PageHeader
          title="Criar Paciente"
          breadcrumb={[
            { label: 'Início', url: paths.root },
            { label: 'Pacientes', url: paths.users },
            { label: 'Criar Paciente', active: true },
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
              <Button  onClick={handleBack}>
                Voltar
              </Button>
              <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                Enviar
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

export default CreateUser;
