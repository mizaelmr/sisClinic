import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { collection, getDocs, doc, setDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { db } from 'lib/firebase';
import { useAuth } from 'providers/AuthProvider';
import paths from 'routes/paths';
import PageHeader from 'components/sections/user-table/PageHeader';
import { User } from 'types/users';
import { Grid, MenuItem } from '@mui/material';
import StyledTextField from 'components/styled/StyledTextField';
import FormAnamnese from 'components/sections/FormAnamnese';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const CreateAnamnese = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const methods = useForm<Omit<User, 'id' | 'name' | 'email' | 'phone' | 'birthday' | 'location' | 'profession' | 'status'>>({
    defaultValues: {},
    mode: 'onChange',
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!user) {
          setLoadingUsers(false);
          return;
        }

        const usersCollection = collection(db, 'users');
        const usersQuery = query(usersCollection, where('physiotherapistId', '==', user.uid));
        const usersSnapshot = await getDocs(usersQuery);

        const anamnesesCollection = collection(db, 'anamneses');
        const anamnesesSnapshot = await getDocs(anamnesesCollection);
        const existingAnamneseUserIds = new Set(
          anamnesesSnapshot.docs
            .filter(doc => {
              const data = doc.data();
              return !data.deletedAt && data.userId;
            })
            .map(doc => doc.data().userId)
        );

        const usersData = usersSnapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              ...data,
              id: doc.id,
            } as unknown as User & { createdAt?: any; deletedAt?: any };
          })
          .filter((user) => {
            const isNotDeleted = !user.deletedAt;
            const isActive = user.status === 'active';
            const hasNoActiveAnamnese = !existingAnamneseUserIds.has(String(user.id));
            return isNotDeleted && isActive && hasNoActiveAnamnese;
          })
          .sort((a, b) => {
            if (a.createdAt && b.createdAt) {
              const aTime = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || 0;
              const bTime = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || 0;
              return bTime - aTime;
            }
            return 0;
          });
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Erro ao carregar pacientes');
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const handleBack = () => {
    navigate(paths.anamneseList);
  };

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId);
    reset({});
  };

  const onSubmit = async (data: any) => {
    if (!selectedUserId) {
      setError('Por favor, selecione um paciente');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const anamneseId = uuidv4();

      if (!user) {
        setError('Você precisa estar logado para criar uma anamnese.');
        setIsSubmitting(false);
        return;
      }

      const anamneseData = {
        ...data,
        userId: selectedUserId,
        physiotherapistId: user.uid,
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'anamneses', anamneseId), anamneseData);

      setSuccess(true);
      console.log('Anamnese saved successfully in Firestore');

      setTimeout(() => {
        navigate(paths.anamneseList);
      }, 1000);
    } catch (err) {
      console.error('Error saving anamnese:', err);
      setError('Erro ao salvar anamnese. Verifique sua conexão e tente novamente.');
      setIsSubmitting(false);
    }
  };

  if (loadingUsers) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  const ButtonSaveAnamnese = () => {
    return (
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end', marginTop: 2 }}>
        <Button onClick={handleBack}>
          Voltar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting || !selectedUserId}
        >
          {isSubmitting ? 'Salvando...' : 'Salvar Anamnese'}
        </Button>
      </Stack>
    );
  }

  return (
    <FormProvider {...methods}>
        <PageHeader
          title="Criar Anamnese"
          breadcrumb={[
            { label: 'Início', url: paths.root },
            { label: 'Anamneses', url: paths.anamneseList },
            { label: 'Criar Anamnese', active: true },
          ]}
        />
        <Paper sx={{ flex: 1, p: 5, pt: 0 }}>
          <Grid container spacing={2}>
            <Grid size={6}>
              <StyledTextField
                select
                fullWidth
                size="large"
                label="Selecione o Paciente"
                value={selectedUserId}
                onChange={(e) => handleUserChange(e.target.value)}
                required
              >
                <MenuItem value="">
                  <em>Selecione um paciente</em>
                </MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={String(user.id)}>
                    {user.name} - {user.cpf}
                  </MenuItem>
                ))}
              </StyledTextField>

              {!selectedUserId && <ButtonSaveAnamnese />}
            </Grid>

            {selectedUserId && (
                <Grid size={12}>
                  <FormAnamnese />
                </Grid>
            )}

            {selectedUserId &&
              <Grid size={12}>
                <ButtonSaveAnamnese />
              </Grid>}
          </Grid>
        </Paper>
    </FormProvider>
  );
};

export default CreateAnamnese;

