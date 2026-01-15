import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Dayjs } from 'dayjs';
import { calendarStyles } from './style';

export const Calendar = ({ selectedDate, handleDateChange }: { selectedDate: Dayjs | null, handleDateChange: (date: Dayjs | null) => void }) => {
    return (
        <DateCalendar
            value={selectedDate}
            onChange={handleDateChange}
            sx={calendarStyles}
        />
    );
};