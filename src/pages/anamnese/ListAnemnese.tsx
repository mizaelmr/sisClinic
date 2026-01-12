import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { collection, getDocs, doc, getDoc, updateDoc, serverTimestamp, FieldValue, query, where } from 'firebase/firestore';
import { db } from 'lib/firebase';
import { useAuth } from 'providers/AuthProvider';
import paths from 'routes/paths';
import PageHeader from 'components/sections/user-table/PageHeader';
import { User } from 'types/users';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import DataGridPagination from 'components/pagination/DataGridPagination';
import IconifyIcon from 'components/base/IconifyIcon';
import DashboardMenu from 'components/common/DashboardMenu';
import dayjs from 'dayjs';
import StyledTextField from 'components/styled/StyledTextField';
import { Grid, InputAdornment } from '@mui/material';

interface AnamneseListItem {
  id: string;
  userId: string;
  userName: string;
  userPhone?: string;
  userCpf?: string;
  createdAt?: any;
  deletedAt?: any;
}

const AnamneseList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [anamneses, setAnamneses] = useState<AnamneseListItem[]>([]);
  const [allAnamneses, setAllAnamneses] = useState<AnamneseListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnamneses = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        const anamnesesCollection = collection(db, 'anamneses');
        const anamnesesQuery = query(anamnesesCollection, where('physiotherapistId', '==', user.uid));
        const anamnesesSnapshot = await getDocs(anamnesesQuery);

        const anamnesesData = await Promise.all(
          anamnesesSnapshot.docs.map(async (anamneseDoc) => {
            const anamneseData = anamneseDoc.data();
            const userId = anamneseData.userId;

            let userName = 'Usuário não encontrado';
            let userPhone = '';
            let userCpf = '';
            let userStatus = '';
            if (userId) {
              try {
                const userDoc = await getDoc(doc(db, 'users', userId));
                if (userDoc.exists()) {
                  const userData = userDoc.data() as User;
                  userName = userData.name || 'Sem nome';
                  userPhone = userData.phone || 'Sem telefone';
                  userCpf = userData.cpf || 'Sem CPF';
                  userStatus = userData.status || '';
                }
              } catch (error) {
                console.error('Error fetching user:', error);
              }
            }

            return {
              id: anamneseDoc.id,
              userId: userId,
              userName: userName,
              userPhone: userPhone,
              userCpf: userCpf,
              userStatus: userStatus,
              createdAt: anamneseData.createdAt,
              deletedAt: anamneseData.deletedAt,
            } as AnamneseListItem & { userStatus?: string };
          })
        );

        const activeAnamneses = anamnesesData.filter((anamnese) => {
          const isNotDeleted = !anamnese.deletedAt;
          const isActive = (anamnese as any).userStatus === 'active';
          return isNotDeleted && isActive;
        });

        const sortedAnamneses = activeAnamneses.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            const aTime = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || 0;
            const bTime = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || 0;
            return bTime - aTime;
          }
          return 0;
        });

        setAnamneses(sortedAnamneses);
        setAllAnamneses(sortedAnamneses);
      } catch (error) {
        console.error('Error fetching anamneses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnamneses();
  }, []);

  const handleEdit = (anamneseId: string) => {
    navigate(`/anamnese/edit/${anamneseId}`);
  };

  const handleDelete = async (anamneseId: string) => {
    if (!window.confirm('Tem certeza que deseja deletar esta anamnese?')) {
      return;
    }

    try {
      await updateDoc(doc(db, 'anamneses', anamneseId), {
        deletedAt: serverTimestamp(),
      } as { deletedAt: FieldValue });

      if (!user) {
        return;
      }

      const anamnesesCollection = collection(db, 'anamneses');
      const anamnesesQuery = query(anamnesesCollection, where('physiotherapistId', '==', user.uid));
      const anamnesesSnapshot = await getDocs(anamnesesQuery);

      const anamnesesData = await Promise.all(
        anamnesesSnapshot.docs.map(async (anamneseDoc) => {
          const anamneseData = anamneseDoc.data();
          const userId = anamneseData.userId;

          let userName = 'Usuário não encontrado';
          let userPhone = '';
          let userCpf = '';
          let userStatus = '';
          if (userId) {
            try {
              const userDoc = await getDoc(doc(db, 'users', userId));
              if (userDoc.exists()) {
                const userData = userDoc.data() as User;
                userName = userData.name || 'Sem nome';
                userPhone = userData.phone || 'Sem telefone';
                userCpf = userData.cpf || 'Sem CPF';
                userStatus = userData.status || '';
              }
            } catch (error) {
              console.error('Error fetching user:', error);
            }
          }

          return {
            id: anamneseDoc.id,
            userId: userId,
            userName: userName,
            userPhone: userPhone,
            userCpf: userCpf,
            userStatus: userStatus,
            createdAt: anamneseData.createdAt,
            deletedAt: anamneseData.deletedAt,
          } as AnamneseListItem & { userStatus?: string };
        })
      );

      const activeAnamneses = anamnesesData.filter((anamnese) => {
        const isNotDeleted = !anamnese.deletedAt;
        const isActive = (anamnese as any).userStatus === 'active';
        return isNotDeleted && isActive;
      });

      const sortedAnamneses = activeAnamneses.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          const aTime = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || 0;
          const bTime = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || 0;
          return bTime - aTime;
        }
        return 0;
      });

      setAnamneses(sortedAnamneses);
      setAllAnamneses(sortedAnamneses);
    } catch (error) {
      console.error('Error deleting anamnese:', error);
      alert('Erro ao deletar anamnese. Tente novamente.');
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    if (searchValue === '') {
      setAnamneses(allAnamneses);
    } else {
      const filteredAnamneses = allAnamneses.filter((anamnese) => {
        return (
          anamnese.userName.toLowerCase().includes(searchValue) ||
          anamnese.userPhone?.toLowerCase().includes(searchValue) ||
          anamnese.userCpf?.toLowerCase().includes(searchValue)
        );
      });
      setAnamneses(filteredAnamneses);
    }
  };

  const columns: GridColDef<AnamneseListItem>[] = [

    {
      field: 'userName',
      headerName: 'Nome do Paciente',
      minWidth: 200,
      flex: 1,
      sortable: false,
    },
    {
      field: 'userPhone',
      headerName: 'Telefone',
      width: 160,
      sortable: false,
      renderCell: (params: GridRenderCellParams<AnamneseListItem>) => {
        return params.row.userPhone || '-';
      },
    },
    {
      field: 'userCpf',
      headerName: 'CPF',
      width: 160,
      sortable: false,
      renderCell: (params: GridRenderCellParams<AnamneseListItem>) => {
        return params.row.userCpf || '-';
      },
    },
    {
      field: 'createdAt',
      headerName: 'Data de Registro',
      width: 180,
      sortable: false,
      renderCell: (params: GridRenderCellParams<AnamneseListItem>) => {
        if (!params.row.createdAt) return '-';
        const date = params.row.createdAt?.toDate?.() ||
          (params.row.createdAt?.seconds ? new Date(params.row.createdAt.seconds * 1000) : null);
        return date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-';
      },
    },
    {
      field: 'action',
      headerName: '',
      filterable: false,
      sortable: false,
      width: 60,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params: GridRenderCellParams<AnamneseListItem>) => (
        <DashboardMenu
          menuItems={[
            {
              label: 'Ver Detalhes',
              onClick: () => navigate(`/anamnese/details/${params.row.id}`),
            },
            {
              label: 'Editar',
              onClick: () => handleEdit(params.row.id),
            },
            {
              label: 'Deletar',
              sx: { color: 'error.main' },
              onClick: () => handleDelete(params.row.id),
            },
          ]}
        />
      ),
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack direction="column" height={1}>
      <PageHeader
        title="Lista de Anamneses"
        breadcrumb={[
          { label: 'Início', url: paths.root },
          { label: 'Anamneses', active: true },
        ]}
      />
      <Paper sx={{ flex: 1, p: { xs: 3, md: 5 } }}>
        <Grid container spacing={4}>
          <Grid size={12}>
            <Stack
              sx={{
                columnGap: 1,
                rowGap: 2,
                justifyContent: 'space-between',
                alignItems: { xl: 'center' },
                flexWrap: { xs: 'wrap', md: 'nowrap' },
              }}
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<IconifyIcon icon="material-symbols:add-rounded" />}
                sx={{ flexShrink: 0 }}
                onClick={() => navigate(paths.createAnamnese)}
              >
                Criar Anamnese
              </Button>

              <StyledTextField
                id="search-box"
                type="search"
                size="medium"
                placeholder="Pesquisar anamnese"
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconifyIcon
                          icon="material-symbols:search-rounded"
                          sx={{
                            fontSize: 20,
                            color: 'text.secondary',
                          }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  maxWidth: { sm: 250 },
                  minWidth: { sm: 200 },
                  order: { xs: 1, sm: 0 },
                  flexGrow: 1,
                  mr: { md: 'auto' },
                  flexBasis: { xs: 'calc(100% - 88px)', sm: 'auto' },
                }}
                onChange={handleSearch}
              />
            </Stack>
          </Grid>

          <Grid size={12}>
            <Box>
              <DataGrid
                rowHeight={64}
                rows={anamneses}
                columns={columns}
                pageSizeOptions={[8]}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 8,
                    },
                  },
                }}
                getRowId={(row) => row.id}
                slots={{
                  basePagination: (props) => <DataGridPagination showFullPagination {...props} />,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Stack>
  );
};

export default AnamneseList;

