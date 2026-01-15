import { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Chip, 
  Container,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';
import { useGoogleCalendar } from 'hooks/useGoogleCalendar';
import IconifyIcon from 'components/base/IconifyIcon';
import { Calendar } from 'components/Calendar';

// COMPONENTE DE CALENDÁRIO E AGENDAMENTOS
const DashboardCalendar = () => {
  const { 
    isSignedIn, 
    loading: googleLoading,
    isLoaded,
    events, 
    handleSignIn, 
    fetchEvents,
    addEvent 
  } = useGoogleCalendar();

  const handleConnectGoogle = async () => {
    setError(null);
    try {
      const success = await handleSignIn();
      if (!success) {
        setError('Não foi possível conectar com Google Calendar');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar com Google Calendar');
    }
  };
  
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [localAppointments, setLocalAppointments] = useState<{ [key: string]: string[] }>({});
  const [openDialog, setOpenDialog] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventStartTime, setNewEventStartTime] = useState<Dayjs | null>(dayjs());
  const [newEventEndTime, setNewEventEndTime] = useState<Dayjs | null>(dayjs().add(1, 'hour'));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isSignedIn && selectedDate) {
      const startOfMonth = selectedDate.startOf('month');
      const endOfMonth = selectedDate.endOf('month');
      fetchEvents(startOfMonth, endOfMonth);
    }
  }, [isSignedIn, selectedDate]);

  const handleDateChange = (newDate: Dayjs | null) => {
    if (!newDate) return;
    setSelectedDate(newDate);
  };

  const getAppointmentsForDate = (date: Dayjs | null) => {
    if (!date) return [];
    
    const dateKey = date.format('YYYY-MM-DD');
    const googleEvents = events
      .filter((event) => {
        const eventDate = event.start.dateTime 
          ? dayjs(event.start.dateTime).format('YYYY-MM-DD')
          : event.start.date;
        return eventDate === dateKey;
      })
      .map((event) => {
        const time = event.start.dateTime 
          ? dayjs(event.start.dateTime).format('HH:mm')
          : 'Dia todo';
        return `${time} - ${event.summary}`;
      });

    const local = localAppointments[dateKey] || [];
    return [...googleEvents, ...local];
  };

  const handleAddAppointment = () => {
    setOpenDialog(true);
  };

  const handleSaveEvent = async () => {
    if (!selectedDate || !newEventTitle || !newEventStartTime || !newEventEndTime) {
      return;
    }

    if (isSignedIn) {
      const startDateTime = selectedDate
        .hour(newEventStartTime.hour())
        .minute(newEventStartTime.minute())
        .toISOString();
      
      const endDateTime = selectedDate
        .hour(newEventEndTime.hour())
        .minute(newEventEndTime.minute())
        .toISOString();

      await addEvent(newEventTitle, startDateTime, endDateTime);
    } else {
      const dateKey = selectedDate.format('YYYY-MM-DD');
      const time = `${newEventStartTime.format('HH:mm')} - ${newEventTitle}`;
      setLocalAppointments((prev) => ({
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), time],
      }));
    }

    setOpenDialog(false);
    setNewEventTitle('');
    setNewEventStartTime(dayjs());
    setNewEventEndTime(dayjs().add(1, 'hour'));
  };

  const allAppointments = { ...localAppointments };
  events.forEach((event) => {
    const eventDate = event.start.dateTime 
      ? dayjs(event.start.dateTime).format('YYYY-MM-DD')
      : event.start.date;
    if (eventDate) {
      const time = event.start.dateTime 
        ? dayjs(event.start.dateTime).format('HH:mm')
        : 'Dia todo';
      if (!allAppointments[eventDate]) {
        allAppointments[eventDate] = [];
      }
      allAppointments[eventDate].push(`${time} - ${event.summary}`);
    }
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          {!isLoaded && !googleLoading && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Não foi possível carregar o Google Calendar. Verifique:
              <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
                <li>Se as credenciais estão configuradas no arquivo .env</li>
                <li>Se o servidor foi reiniciado após adicionar as credenciais</li>
                <li>Se há bloqueadores de popup ou extensões do navegador interferindo</li>
              </ul>
            </Alert>
          )}
          <Calendar selectedDate={selectedDate} handleDateChange={handleDateChange} />
        </Box>
        
        <Box sx={{ flex: 1, mt: { xs: 2, md: 0 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Agendamentos para {selectedDate?.format('DD/MM/YYYY')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {!isSignedIn && isLoaded && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleConnectGoogle}
                  disabled={googleLoading || !isLoaded}
                  startIcon={<IconifyIcon icon="logos:google-icon" />}
                >
                  {googleLoading ? 'Conectando...' : 'Conectar'}
                </Button>
              )}
              <Button
                variant="outlined"
                size="small"
                onClick={handleAddAppointment}
                disabled={!isSignedIn}
                startIcon={<IconifyIcon icon="mdi:plus" />}
              >
                Adicionar
              </Button>
            </Box>
          </Box>
          
          {getAppointmentsForDate(selectedDate).length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {getAppointmentsForDate(selectedDate).map((appointment, index) => (
                <Chip
                  key={index}
                  label={appointment}
                  color="primary"
                  variant="outlined"
                  sx={{ justifyContent: 'flex-start' }}
                />
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Nenhum agendamento para esta data. Clique no botão "+ Adicionar" para criar um agendamento.
            </Typography>
          )}
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Dias com agendamentos:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Object.keys(allAppointments).map((dateKey) => (
                <Chip
                  key={dateKey}
                  label={`${dayjs(dateKey).format('DD/MM')} (${allAppointments[dateKey].length})`}
                  size="small"
                  color="success"
                  variant="outlined"
                  onClick={() => setSelectedDate(dayjs(dateKey))}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Novo Agendamento</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Título"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TimePicker
              label="Horário de Início"
              value={newEventStartTime}
              onChange={(newValue) => setNewEventStartTime(newValue)}
              sx={{ mt: 2, width: '100%' }}
            />
            <TimePicker
              label="Horário de Término"
              value={newEventEndTime}
              onChange={(newValue) => setNewEventEndTime(newValue)}
              sx={{ mt: 2, width: '100%' }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button onClick={handleSaveEvent} variant="contained" disabled={!newEventTitle}>
              Salvar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

// COMPONENTE PRINCIPAL DO DASHBOARD
const Dashboard = () => {
  return (
    <Container>
      <Typography variant="h6" sx={{ mt: 2 }}>Agenda:</Typography>
      <DashboardCalendar />
    </Container>
  );
};

export default Dashboard;