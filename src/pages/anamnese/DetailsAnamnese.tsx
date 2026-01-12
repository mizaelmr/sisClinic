import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { doc, getDoc } from 'firebase/firestore';
import { db } from 'lib/firebase';
import { useAuth } from 'providers/AuthProvider';
import paths from 'routes/paths';
import PageHeader from 'components/sections/user-table/PageHeader';
import { User } from 'types/users';
import { Grid, Typography, Box, Divider, Chip } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import dayjs from 'dayjs';

interface AnamneseData {
  userId?: string;
  createdAt?: any;
  deletedAt?: any;
  medicineOption?: string;
  medicine?: string;
  dysfunctionOption?: string;
  dysfunction?: string;
  eatingHabits?: string;
  intestine?: string;
  gestationOption?: string;
  gestation?: string;
  gestationTime?: string;
  physicalActivityOption?: string;
  physicalActivity?: string;
  health?: string;
  hypertension?: string;
  cardiac?: string;
  cramps?: string;
  surgery?: string;
  painOption?: string;
  pain?: string;
  painEVA?: string;
  urinaryOption?: string;
  urinary?: string;
  urinaryCorrection?: string;
  herniaOption?: string;
  hernia?: string;
  herniaCorrection?: string;
  competence?: string;
  restTone?: string;
  dynamicTonicity?: string;
  domeDiaphragmatic?: string;
  diastasis?: string;
  supraAbdominal?: number;
  waist?: number;
  bellyButton?: number;
  infraAbdominal?: number;
  [key: string]: any;
}

const AnamneseDetails = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anamneseData, setAnamneseData] = useState<AnamneseData | null>(null);
  const [userData, setUserData] = useState<User | null>(null);

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

        const data = anamneseDoc.data();

        if (user && data.physiotherapistId !== user.uid) {
          setError('Você não tem permissão para visualizar esta anamnese.');
          setTimeout(() => {
            navigate(paths.anamneseList);
          }, 2000);
          return;
        }

        setAnamneseData(data as AnamneseData);

        if (data.userId) {
          try {
            const userDoc = await getDoc(doc(db, 'users', data.userId));
            if (userDoc.exists()) {
              setUserData(userDoc.data() as User);
            }
          } catch (error) {
            console.error('Error fetching user:', error);
          }
        }
      } catch (err) {
        console.error('Error fetching anamnese:', err);
        setError('Erro ao carregar anamnese');
      } finally {
        setLoading(false);
      }
    };

    fetchAnamnese();
  }, [id, navigate]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    const date = timestamp?.toDate?.() || (timestamp?.seconds ? new Date(timestamp.seconds * 1000) : null);
    return date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-';
  };

  const formatValue = (value: any): string => {
    if (value === undefined || value === null || value === '') return '-';
    if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
    return String(value);
  };

  const getStatusLabel = (option: string, value?: string) => {
    if (option === 'sim') {
      return value ? `Sim - ${value}` : 'Sim';
    }
    return option === 'não' ? 'Não' : formatValue(option);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !anamneseData) {
    return (
      <Stack direction="column" height={1}>
        <PageHeader
          title="Detalhes da Anamnese"
          breadcrumb={[
            { label: 'Início', url: paths.root },
            { label: 'Anamneses', url: paths.anamneseList },
            { label: 'Detalhes', active: true },
          ]}
        />
        <Paper sx={{ flex: 1, p: { xs: 3, md: 5 } }}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="error">
              {error || 'Anamnese não encontrada'}
            </Typography>
          </Box>
        </Paper>
      </Stack>
    );
  }

  return (
    <Stack direction="column" height={1}>
      <PageHeader
        title={`Detalhes da Anamnese${userData ? ` - ${userData.name}` : ''}`}
        breadcrumb={[
          { label: 'Início', url: paths.root },
          { label: 'Anamneses', url: paths.anamneseList },
          { label: 'Detalhes', active: true },
        ]}
      />
      <Paper sx={{ flex: 1, p: { xs: 3, md: 5 } }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            {userData && (
              <>
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Informações do Paciente
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="body2" color="text.secondary">Nome</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{userData.name}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="body2" color="text.secondary">CPF</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{userData.cpf}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="body2" color="text.secondary">Telefone</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{userData.phone}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="body2" color="text.secondary">Email</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{userData.email}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </>
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Informações da Anamnese
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary">Data de Criação</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{formatDate(anamneseData.createdAt)}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid size={6}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Dados Clínicos
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Medicamentos</Typography>
                <Typography variant="body1">
                  {getStatusLabel(anamneseData.medicineOption || '', anamneseData.medicine)}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Disfunção Hormonal</Typography>
                <Typography variant="body1">
                  {getStatusLabel(anamneseData.dysfunctionOption || '', anamneseData.dysfunction)}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Hábitos Alimentares</Typography>
                <Typography variant="body1">{formatValue(anamneseData.eatingHabits)}</Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Funcionamento do Intestino</Typography>
                <Typography variant="body1">{formatValue(anamneseData.intestine)}</Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Gestação</Typography>
                <Typography variant="body1">
                  {anamneseData.gestationOption === 'sim'
                    ? `Sim - ${formatValue(anamneseData.gestationTime)}`
                    : formatValue(anamneseData.gestationOption)}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Atividade Física</Typography>
                <Typography variant="body1">
                  {getStatusLabel(anamneseData.physicalActivityOption || '', anamneseData.physicalActivity)}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Problema de Saúde Crônico</Typography>
                <Typography variant="body1">{formatValue(anamneseData.health)}</Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Hipertensão</Typography>
                <Typography variant="body1">{formatValue(anamneseData.hypertension)}</Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Cardíaco</Typography>
                <Typography variant="body1">{formatValue(anamneseData.cardiac)}</Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Cólicas Menstruais</Typography>
                <Typography variant="body1">{formatValue(anamneseData.cramps)}</Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Cirurgia Recente</Typography>
                <Typography variant="body1">{formatValue(anamneseData.surgery)}</Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Dores na Coluna</Typography>
                <Typography variant="body1">
                  {anamneseData.painOption === 'sim'
                    ? `Sim - EVA: ${formatValue(anamneseData.painEVA)}`
                    : formatValue(anamneseData.painOption)}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Perda Urinária</Typography>
                <Typography variant="body1">
                  {anamneseData.urinaryOption === 'sim'
                    ? `Sim - Correção: ${formatValue(anamneseData.urinaryCorrection)}`
                    : formatValue(anamneseData.urinaryOption)}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Hérnia Abdominal</Typography>
                <Typography variant="body1">
                  {anamneseData.herniaOption === 'sim'
                    ? `Sim - Correção: ${formatValue(anamneseData.herniaCorrection)}`
                    : formatValue(anamneseData.herniaOption)}
                </Typography>
              </Grid>
            </Grid>


          </Grid>
          <Grid size={6}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Avaliação Física
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Competência Abdominal</Typography>
                <Typography variant="body1">{formatValue(anamneseData.competence)}</Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Tonicidade em Repouso</Typography>
                <Typography variant="body1">{formatValue(anamneseData.restTone)}</Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Tonicidade Dinâmica</Typography>
                <Typography variant="body1">{formatValue(anamneseData.dynamicTonicity)}</Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Cúpula Diafragmática</Typography>
                <Typography variant="body1">{formatValue(anamneseData.domeDiaphragmatic)}</Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Diástase</Typography>
                <Typography variant="body1">{formatValue(anamneseData.diastasis)}</Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Supra Abdominal</Typography>
                <Typography variant="body1">{formatValue(anamneseData.supraAbdominal)}</Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Cintura</Typography>
                <Typography variant="body1">{formatValue(anamneseData.waist)}</Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Umbigo</Typography>
                <Typography variant="body1">{formatValue(anamneseData.bellyButton)}</Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Infra Abdominal</Typography>
                <Typography variant="body1">{formatValue(anamneseData.infraAbdominal)}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid size={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2 }}>
                <Button onClick={() => navigate(paths.anamneseList)}>
                  Voltar
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate(`/anamnese/edit/${id}`)}
                >
                  Editar
                </Button>
              </Box>
            </Grid>
        </Grid>



      </Paper>
    </Stack>
  );
};

export default AnamneseDetails;




