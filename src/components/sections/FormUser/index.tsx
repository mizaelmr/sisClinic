import { useFormContext, Controller } from 'react-hook-form';
import { forwardRef } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';
import { IMaskInput } from 'react-imask';
import StyledTextField from 'components/styled/StyledTextField';
import { User } from 'types/users';
import { MenuItem } from '@mui/material';

dayjs.locale('pt-br');

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const PhoneMaskInput = forwardRef<HTMLInputElement, CustomProps>(
  function PhoneMaskInput(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="(00) 00000-0000"
        inputRef={ref}
        onAccept={(value: string) => {
          onChange({
            target: {
              name: props.name,
              value,
            },
          });
        }}
      />
    );
  }
);

const FormUser = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<User>();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Box component="form" noValidate>
        <Grid container spacing={3}>
          <Grid size={6}>
            <StyledTextField
              {...register('name', {
                required: 'Esse campo é obrigatorio!',
                minLength: {
                  value: 3,
                  message: 'Deve ter mais de 2 caracteres!',
                },
              })}
              autoComplete='off'
              fullWidth
              size="large"
              label="Nome"
              error={errors.name ? true : false}
              helperText={errors.name?.message}
            />
          </Grid>
          <Grid size={6}>
            <StyledTextField
              {...register('cpf', {
                pattern: {
                  value: /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/,
                  message: 'CPF inválido!',
                },
              })}
              autoComplete='off'
              fullWidth
              size="large"
              label="CPF"
              error={errors.cpf ? true : false}
              helperText={errors.cpf?.message}
            />
          </Grid>

          <Grid size={6}>
            <StyledTextField
              {...register('profession', {
                required: 'Esse campo é obrigatorio!',
                minLength: {
                  value: 3,
                  message: 'Deve ter mais de 2 caracteres!',
                },
              })}
              autoComplete='off'
              fullWidth
              size="large"
              label="Profissão"
              error={errors.profession ? true : false}
              helperText={errors.profession?.message}
            />
          </Grid>

          <Grid size={6}>
            <Controller
              name="status"
              control={control}
              rules={{
                required: 'Esse campo é obrigatorio!',
              }}
              render={({ field }) => (
                <StyledTextField
                  {...field}
                  select
                  autoComplete='off'
                  fullWidth
                  size="large"
                  label="Status do cliente"
                  error={errors.status ? true : false}
                  helperText={errors.status?.message}
                >
                  <MenuItem value="active">Ativo</MenuItem>
                  <MenuItem value="inactive">Inativo</MenuItem>
                </StyledTextField>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <StyledTextField
              autoComplete='off'
              {...register('email', {
                required: 'Esse campo é obrigatorio!',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Endereço de e-mail inválido!',
                },
              })}
              fullWidth
              size="large"
              type="email"
              label="E-mail"
              error={errors.email ? true : false}
              helperText={errors.email?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="phone"
              control={control}
              rules={{
                required: 'Esse campo é obrigatório!',
                validate: (value) => {
                  const cleaned = value.replace(/\D/g, '');
                  return cleaned.length === 11 || 'Número de telefone inválido!';
                },
              }}
              render={({ field }) => (
                <StyledTextField
                  {...field}
                  fullWidth
                  autoComplete='off'
                  size="large"
                  label="Telefone"
                  error={errors.phone ? true : false}
                  helperText={errors.phone?.message}
                  InputProps={{
                    inputComponent: PhoneMaskInput as any,
                  }}
                  inputProps={{
                    name: field.name,
                  }}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <StyledTextField
              autoComplete='off'
                {...register('location', {
                required: 'Esse campo é obrigatorio!',
                minLength: {
                  value: 3,
                  message: 'Deve ter mais de 2 caracteres!',
                },
              })}
              fullWidth
              size="large"
              label="Localização"
              error={errors.location ? true : false}
              helperText={errors.location?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="birthday"
              control={control}
              rules={{
                required: 'Esse campo é obrigatorio!',
                validate: (value) => {
                  if (!value) return 'Data de nascimento é obrigatória!';
                  const selectedDate = dayjs(value);
                  const today = dayjs();
                  if (selectedDate.isAfter(today)) {
                    return 'Data de nascimento não pode ser futura!';
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <DatePicker
                  label="Data de Nascimento"
                  maxDate={dayjs()}
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(newValue: Dayjs | null) => {
                    field.onChange(newValue ? newValue.format('YYYY-MM-DD') : '');
                  }}
                  format="DD/MM/YYYY"
                  enableAccessibleFieldDOMStructure={false}
                  slots={{
                    textField: StyledTextField,
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'large' as const,
                      error: errors.birthday ? true : false,
                      helperText: errors.birthday?.message,
                    },
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default FormUser;
