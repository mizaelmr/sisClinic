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
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import FormAnamnese from 'components/sections/FormAnamnese';

const EditAnamnese = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>('');

  const methods = useForm<Omit<User, 'id' | 'name' | 'email' | 'phone' | 'birthday' | 'location' | 'profession' | 'status'>>({
    defaultValues: {},
    mode: 'onChange',
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    const fetchAnamnese = async () => {
      if (!id) {
        navigate(paths.anamneseList);
        return;
      }

      try {
        setLoading(true);
        const anamneseDoc = await getDoc(doc(db, 'anamneses', id));
        
        if (!anamneseDoc.exists()) {
          setError('Anamnese não encontrada');
          setTimeout(() => {
            navigate(paths.anamneseList);
          }, 2000);
          return;
        }

        const anamneseData = anamneseDoc.data();
        if (user && anamneseData.physiotherapistId !== user.uid) {
          setError('Você não tem permissão para editar esta anamnese.');
          setTimeout(() => {
            navigate(paths.anamneseList);
          }, 2000);
          return;
        }
        
        const userId = anamneseData.userId;

        if (userId) {
          try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
              const userData = userDoc.data() as User;
              setUserName(userData.name || 'Paciente');
            }
          } catch (error) {
            console.error('Error fetching user:', error);
          }
        }

        const { userId: _, createdAt: __, deletedAt: ___, ...anamneseFields } = anamneseData;
        
        reset(anamneseFields as any);
      } catch (err) {
        console.error('Error fetching anamnese:', err);
        setError('Erro ao carregar anamnese');
      } finally {
        setLoading(false);
      }
    };

    fetchAnamnese();
  }, [id, navigate, reset]);

  const handleBack = () => {
    navigate(paths.anamneseList);
  };

  const onSubmit = async (data: any) => {
    if (!id) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const { deletedAt: _, ...anamneseData } = data as any;
      await updateDoc(doc(db, 'anamneses', id), {
        ...anamneseData,
        updatedAt: serverTimestamp(),
      } as { updatedAt: FieldValue });

      setSuccess(true);
      console.log('Anamnese updated successfully in Firestore');

      setTimeout(() => {
        navigate(paths.anamneseList);
      }, 1000);
    } catch (err) {
      console.error('Error updating anamnese:', err);
      setError('Erro ao atualizar anamnese. Verifique sua conexão e tente novamente.');
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
        <PageHeader
          title="Editar Anamnese"
          breadcrumb={[
            { label: 'Início', url: paths.root },
            { label: 'Anamneses', url: paths.anamneseList },
            { label: `Editar Anamnese - ${userName}`, active: true },
          ]}
        />
        <Paper sx={{ flex: 1, pt: 0, p: { xs: 3, md: 5 } }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <FormAnamnese />
              </Grid>

              <Grid size={12}>
                <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
                  <Button onClick={handleBack}>
                    Voltar
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={handleSubmit(onSubmit)} 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Atualizando...' : 'Atualizar Anamnese'}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
        </Paper>
    </FormProvider>
  );
};

export default EditAnamnese;

