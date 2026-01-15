export const calendarStyles = {
  width: '100%',
  '& .MuiDayCalendar-header': {
    '& .MuiDayCalendar-weekDayLabel': {
      fontWeight: 600,
      fontSize: '0.875rem',
      color: 'text.secondary',
      padding: '8px 0',
    },
  },
  '& .MuiPickersDay-root': {
    position: 'relative',
    fontSize: '0.9375rem',
    fontWeight: 500,
    borderRadius: '10px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    minWidth: '36px',
    height: '36px',
    '&:hover': {
      backgroundColor: 'primary.lighter',
      transform: 'scale(1.08)',
    },
    '&.Mui-selected': {
      backgroundColor: 'primary.main',
      color: 'primary.contrastText',
      fontWeight: 700,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      '&:hover': {
        backgroundColor: 'primary.dark',
        transform: 'scale(1.08)',
      },
      '&:focus': {
        backgroundColor: 'primary.dark',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      },
    },
    '&.MuiPickersDay-today': {
      border: '2px solid',
      borderColor: 'primary.main',
      fontWeight: 600,
      '&:not(.Mui-selected)': {
        backgroundColor: 'transparent',
      },
    },
  },
  '& .MuiPickersCalendarHeader-root': {
    paddingLeft: 2,
    paddingRight: 2,
    paddingBottom: 1,
    '& .MuiPickersCalendarHeader-label': {
      fontWeight: 600,
      fontSize: '1.125rem',
      color: 'text.primary',
    },
    '& .MuiIconButton-root': {
      color: 'text.primary',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        backgroundColor: 'action.hover',
        transform: 'scale(1.1)',
      },
    },
  },
};