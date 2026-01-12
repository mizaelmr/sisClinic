import { RefObject, useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Chip, { ChipOwnProps } from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { collection, getDocs, doc, updateDoc, serverTimestamp, FieldValue, query, where } from 'firebase/firestore';
import { db } from 'lib/firebase';
import { useAuth } from 'providers/AuthProvider';
import dayjs from 'dayjs';
import { User } from 'types/users';
import DashboardMenu from 'components/common/DashboardMenu';
import DataGridPagination from 'components/pagination/DataGridPagination';

interface UsersTableProps {
  apiRef: RefObject<GridApiCommunity | null>;
  filterButtonEl: HTMLButtonElement | null;
}

const getStatusChipColor = (value: User['status']): ChipOwnProps['color'] => {
  switch (value) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'error';
    case 'pending':
      return 'warning';
    default:
      return 'neutral';
  }
};

const UsersTable = ({ apiRef, filterButtonEl }: UsersTableProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      if (!user) {
        setLoading(false);
        return;
      }

      const usersCollection = collection(db, 'users');
      const usersQuery = query(usersCollection, where('physiotherapistId', '==', user.uid));
      const usersSnapshot = await getDocs(usersQuery);
      
      const usersData = usersSnapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
          } as unknown as User & { createdAt?: any; deletedAt?: any };
        })
        .filter((user) => {
          return !user.deletedAt;
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId: string | number) => {
    if (!window.confirm('Tem certeza que deseja deletar este usuário?')) {
      return;
    }

    try {
      const userIdString = String(userId);
      
      await updateDoc(doc(db, 'users', userIdString), {
        deletedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      } as { deletedAt: FieldValue; updatedAt: FieldValue });
      
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Erro ao deletar usuário. Tente novamente.');
    }
  };

  const handleEdit = (userId: string | number) => {
    navigate(`/users/edit/${String(userId)}`);
  };

  const handleStatusToggle = async (userId: string | number, currentStatus: string) => {
    try {
      const userIdString = String(userId);
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      await updateDoc(doc(db, 'users', userIdString), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      } as { status: string; updatedAt: FieldValue });
      
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Erro ao atualizar status do usuário. Tente novamente.');
    }
  };

  const columns: GridColDef<User>[] = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Nome',
        minWidth: 160,
        flex: 1,
        sortable: false,
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 120,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        renderCell: (params: GridRenderCellParams<User>) => {
          const statusLabel =
            params.row.status === 'active'
              ? 'Ativo'
              : params.row.status === 'inactive'
                ? 'Inativo'
                : 'Pendente';
          return (
            <Chip
              label={statusLabel}
              color={getStatusChipColor(params.row.status)}
              onClick={() => handleStatusToggle(params.row.id, params.row.status)}
              sx={{
                textTransform: 'capitalize',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            />
          );
        },
      },
      {
        field: 'phone',
        headerName: 'Telefone',
        width: 160,
        sortable: false,
        filterable: false,
      },
      {
        field: 'profession',
        headerName: 'Profissão',
        width: 180,
        sortable: false,
      },
      {
        field: 'birthday',
        headerName: 'Data de Aniversário',
        width: 180,
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams<User>) => {
          if (!params.row.birthday) return '-';
          const date = dayjs(params.row.birthday);
          return date.isValid() ? date.format('DD/MM/YYYY') : params.row.birthday;
        },
      },
      {
        field: 'location',
        headerName: 'Localização',
        width: 180,
        sortable: false,
      },
      {
        field: 'action',
        headerName: '',
        filterable: false,
        sortable: false,
        width: 60,
        align: 'right',
        headerAlign: 'right',
        renderCell: (params: GridRenderCellParams<User>) => (
          <DashboardMenu
            menuItems={[
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
    ],
    [],
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: 1 }}>
      <DataGrid
        rowHeight={64}
        rows={users}
        apiRef={apiRef}
        columns={columns}
        pageSizeOptions={[8]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 8,
            },
          },
        }}
        getRowId={(row) => String(row.id) || Math.random().toString()}
        slots={{
          basePagination: (props) => <DataGridPagination showFullPagination {...props} />,
        }}
        slotProps={{
          panel: {
            target: filterButtonEl,
          },
        }}
      />
    </Box>
  );
};

export default UsersTable;
