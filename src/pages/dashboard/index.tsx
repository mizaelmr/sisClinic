import { useState } from 'react';
import Grid from '@mui/material/Grid';
import { Card, CardContent, Typography, Box, Chip, Container } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';

// PÁGINA DO DASHBOARD
const clientList = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    address: '123 Main St, Anytown, USA',
  },
  {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1234567890',
    address: '123 Main St, Anytown, USA',
  },
  {
    name: 'Jim Doe',
    email: 'jim.doe@example.com',
    phone: '+1234567890',
    address: '123 Main St, Anytown, USA',
  },
  {
    name: 'Jill Doe',
    email: 'jill.doe@example.com',
    phone: '+1234567890',
    address: '123 Main St, Anytown, USA',
  },
  {
    name: 'Jack Doe',
    email: 'jack.doe@example.com',
    phone: '+1234567890',
    address: '123 Main St, Anytown, USA',
  },
];

const appointmentList = [
  {
    name: 'John Doe',
    date: '2021-01-01',
    time: '10:00',
    status: 'pending',
  },
  {
    name: 'Jane Doe',
    date: '2021-01-01',
    time: '10:00',
    status: 'pending',
  },
  {
    name: 'Jim Doe',
    date: '2021-01-01',
    time: '10:00',
    status: 'pending',
  },
  {
    name: 'Jill Doe',
    date: '2021-01-01',
    time: '10:00',
    status: 'pending',
  },
];

const CardAppointment = ({ appointment }: { appointment: any }) => {
  return (
    <Card sx={{ height: "100%" }} >
      <CardContent>
        <Typography fontWeight={700} style={{ fontSize: '1.25rem', color: '#000' }} variant="h6">{appointment.name}</Typography>
        <Typography fontWeight={400} style={{ fontSize: '1rem', color: '#000' }} variant="body1">{appointment.date}</Typography>
        <Typography fontWeight={400} style={{ fontSize: '1rem', color: '#000' }} variant="body1">{appointment.time}</Typography>
        <Typography fontWeight={400} style={{ fontSize: '1rem', color: '#000' }} variant="body1">{appointment.status}</Typography>
      </CardContent>
    </Card>
  );
};

const CardClient = ({ client }: { client: any }) => {
  return (
    <Card sx={{ height: "100%" }} >
      <CardContent>
        <Typography fontWeight={700} style={{ fontSize: '1.25rem', color: '#000' }} variant="h6">{client.name}</Typography>
      </CardContent>
      <CardContent>
        <Typography fontWeight={400} style={{ fontSize: '1rem', color: '#000' }} variant="body1">{client.email}</Typography>
        <Typography fontWeight={400} style={{ fontSize: '1rem', color: '#000' }} variant="body1">{client.phone}</Typography>
        <Typography fontWeight={400} style={{ fontSize: '1rem', color: '#000' }} variant="body1">{client.address}</Typography>
      </CardContent>
    </Card>
  );
};

// COMPONENTE DE CALENDÁRIO E AGENDAMENTOS
const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [appointments, setAppointments] = useState<{ [key: string]: string[] }>({
    [dayjs().format('YYYY-MM-DD')]: ['10:00 - João Silva', '14:00 - Maria Santos'],
  });

  const handleDateChange = (newDate: Dayjs | null) => {
    if (!newDate) return;
    
    setSelectedDate(newDate);
    
    const dateKey = newDate.format('YYYY-MM-DD');
    const existingAppointments = appointments[dateKey] || [];
    
    if (existingAppointments.length === 0) {
      const time = prompt('Digite o horário do agendamento (ex: 10:00 - Nome do Cliente):');
      if (time) {
        setAppointments((prev) => ({
          ...prev,
          [dateKey]: [time],
        }));
      }
    }
  };

  const getAppointmentsForDate = (date: Dayjs | null) => {
    if (!date) return [];
    return appointments[date.format('YYYY-MM-DD')] || [];
  };

  const hasAppointments = (date: Dayjs | null) => {
    if (!date) return false;
    const dateKey = date.format('YYYY-MM-DD');
    return appointments[dateKey] && appointments[dateKey].length > 0;
  };

  const addAppointment = () => {
    if (!selectedDate) return;
    const dateKey = selectedDate.format('YYYY-MM-DD');
    const time = prompt('Digite o horário do agendamento (ex: 10:00 - Nome do Cliente):');
    if (time) {
      setAppointments((prev) => ({
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), time],
      }));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 1 }}>
          <DateCalendar
            value={selectedDate}
            onChange={handleDateChange}
            sx={{
              '& .MuiPickersDay-root': {
                position: 'relative',
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                },
              },
            }}
          />
        </Box>
        <Box sx={{ flex: 1, mt: { xs: 2, md: 0 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Agendamentos para {selectedDate?.format('DD/MM/YYYY')}
            </Typography>
            <Chip
              label="+ Adicionar"
              onClick={addAppointment}
              color="primary"
              variant="outlined"
              sx={{ cursor: 'pointer' }}
            />
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
              Nenhum agendamento para esta data. Clique em um dia no calendário ou no botão "+ Adicionar" para criar um agendamento.
            </Typography>
          )}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Dias com agendamentos:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Object.keys(appointments).map((dateKey) => (
                <Chip
                  key={dateKey}
                  label={`${dayjs(dateKey).format('DD/MM')} (${appointments[dateKey].length})`}
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
      </Box>
    </LocalizationProvider>
  );
};

// COMPONENTE PRINCIPAL DO DASHBOARD
const Dashboard = () => {
  return (
    <Container>
        <Typography variant="h6" sx={{ mt: 2 }}>Agenda:</Typography>
        <Calendar />
    </Container>
  );
};


export default Dashboard;
