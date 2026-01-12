import { Divider, Stack, Typography } from '@mui/material';
import AccountTabPanelSection from '../common/AccountTabPanelSection';
import Address from './Address';
import Email from './Email';
import Names from './Names';
import Phone from './Phone';
import UserName from './UserName';
import IconifyIcon from 'components/base/IconifyIcon';

const PersonalInfoTabPanel = () => {
  return (
    <Stack direction="column" divider={<Divider />} spacing={2}>
      <Typography
        variant="h4"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontSize: {
            xs: 'h4.fontSize',
            md: 'h6.fontSize',
            lg: 'h4.fontSize',
          },
        }}
      >
        <IconifyIcon
          icon="material-symbols:settings-outline"
          sx={{ fontSize: { xs: 20, lg: 24 } }}
        />
        <Typography variant="h6" sx={{ fontSize: { xs: 18, lg: 20 } }}>
          Configurações do Usuário
        </Typography>
      </Typography>
      <AccountTabPanelSection
        title="Nome"
        subtitle="Edite seu nome aqui se desejar fazer alterações. Você também pode editar seu nome de usuário que será exibido publicamente."
        icon="material-symbols:badge-outline"
      >
        <Stack direction="column" spacing={1}>
          <Names />
          <UserName />
        </Stack>
      </AccountTabPanelSection>

      <AccountTabPanelSection
        title="Endereço"
        subtitle="Você pode editar seu endereço e controlar quem pode vê-lo."
        icon="material-symbols:location-on-outline"
      >
        <Address />
      </AccountTabPanelSection>

      <AccountTabPanelSection
        title="Telefone"
        subtitle="Adicione um número de telefone pessoal ou oficial para se manter conectado com facilidade e garantir que as opções de recuperação de conta estejam disponíveis."
        icon="material-symbols:call-outline"
      >
        <Phone />
      </AccountTabPanelSection>

      <AccountTabPanelSection
        title="Endereço de E-mail"
        subtitle="Edite seu endereço de e-mail principal para notificações e adicione um endereço de e-mail alternativo para maior segurança e flexibilidade de comunicação."
        icon="material-symbols:mail-outline"
      >
        <Email />
      </AccountTabPanelSection>
    </Stack>
  );
};

export default PersonalInfoTabPanel;
