import { useFormContext, Controller } from 'react-hook-form';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import StyledTextField from 'components/styled/StyledTextField';
import StyledFormControl from 'components/styled/StyledFormControl';
import { Select, MenuItem, InputLabel, FormHelperText, Typography } from '@mui/material';

interface AnamneseFormData {
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
  [key: string]: any; // Allow additional fields
}

const FormAnamnese = () => {
  const {
    register,
    control,
    formState: { errors },
    setValue,

  } = useFormContext<AnamneseFormData>();


  return (
    <Box sx={{ p: "10px"}} component="form" noValidate>
      <Grid container spacing={3}>
        <Grid size={6}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Medicamentos
          </Typography>
          <Controller
            name="medicineOption"
            control={control}
            rules={{ required: 'Selecione o campo' }}
            render={({ field: { onChange, value } }) => (
              <>
                <RadioGroup
                  value={value || ''}
                  onChange={(e) => {
                    onChange(e);
                    setValue('medicine', e.target.value === 'sim' ? '' : 'não');
                  }}
                  row
                >
                  <FormControlLabel value="sim" control={<Radio />} label="Sim" />
                  <FormControlLabel value="não" control={<Radio />} label="Não" />
                </RadioGroup>
                {value === 'sim' && (
                  <Box sx={{ mt: 2 }}>
                    <StyledTextField
                      {...register('medicine', {
                        required: 'Este campo é obrigatório!',
                      })}
                      
                      size="large"
                      label="Qual?"
                      error={errors.medicine ? true : false}
                      helperText={errors.medicine?.message}
                    />
                  </Box>
                )}
                {errors.medicineOption && (
                  <FormHelperText error>{errors.medicineOption.message}</FormHelperText>
                )}
              </>
            )}
          />
        </Grid>

        {/* 2. Disfunção Hormonal */}
        <Grid size={6}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Disfunção Hormonal
          </Typography>
          <Controller
            name="dysfunctionOption"
            control={control}
            rules={{ required: 'Selecione o campo' }}
            render={({ field: { onChange, value } }) => (
              <>
                <RadioGroup
                  value={value || ''}
                  onChange={(e) => {
                    onChange(e);
                    setValue('dysfunction', e.target.value === 'sim' ? '' : 'não');
                  }}
                  row
                >
                  <FormControlLabel value="sim" control={<Radio />} label="Sim" />
                  <FormControlLabel value="não" control={<Radio />} label="Não" />
                </RadioGroup>
                {value === 'sim' && (
                  <Box sx={{ mt: 2 }}>
                    <StyledTextField
                      {...register('dysfunction', {
                        required: 'Este campo é obrigatório!',
                      })}
                      
                      size="large"
                      label="Qual?"
                      error={errors.dysfunction ? true : false}
                      helperText={errors.dysfunction?.message}
                    />
                  </Box>
                )}
                {errors.dysfunctionOption && (
                  <FormHelperText error>{errors.dysfunctionOption.message}</FormHelperText>
                )}
              </>
            )}
          />
        </Grid>

        {/* 3. Hábitos Alimentares */}
        <Grid size={6}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Hábitos Alimentares
          </Typography>
          <Controller
            name="eatingHabits"
            control={control}
            rules={{ required: 'Selecione o campo' }}
            render={({ field }) => (
              <RadioGroup {...field} row>
                <FormControlLabel value="livre" control={<Radio />} label="Livre" />
                <FormControlLabel value="balanceada" control={<Radio />} label="Balanceada" />
                <FormControlLabel
                  value="acompanhada"
                  control={<Radio />}
                  label="Acompanhada de nutricionista"
                />
              </RadioGroup>
            )}
          />
          {errors.eatingHabits && (
            <FormHelperText error>{errors.eatingHabits.message}</FormHelperText>
          )}
        </Grid>

        {/* 4. Funcionamento do Intestino */}
        <Grid size={{ xs: 6, md: 6 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Funcionamento do Intestino
          </Typography>
          <Controller
            name="intestine"
            control={control}
            rules={{ required: 'Selecione o campo' }}
            render={({ field }) => (
              <RadioGroup {...field} row>
                <FormControlLabel value="constipação" control={<Radio />} label="Constipação" />
                <FormControlLabel value="normal" control={<Radio />} label="Normal" />
              </RadioGroup>
            )}
          />
          {errors.intestine && <FormHelperText error>{errors.intestine.message}</FormHelperText>}
        </Grid>

        {/* 5. Gestação */}
        <Grid size={6}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Gestação
          </Typography>
          <Controller
            name="gestationOption"
            control={control}
            rules={{ required: 'Selecione o campo' }}
            render={({ field: { onChange, value } }) => (
              <>
                <RadioGroup
                  value={value || ''}
                  onChange={(e) => {
                    onChange(e);
                    setValue('gestation', e.target.value);
                  }}
                  row
                >
                  <FormControlLabel value="sim" control={<Radio />} label="Sim" />
                  <FormControlLabel value="não" control={<Radio />} label="Não" />
                </RadioGroup>
                {value === 'sim' && (
                  <Box sx={{ mt: 2 }}>
                    <StyledTextField
                      {...register('gestationTime', {
                        required: 'Este campo é obrigatório!',
                      })}
                      
                      size="large"
                      label="Tempo da última?"
                      error={errors.gestationTime ? true : false}
                      helperText={errors.gestationTime?.message}
                    />
                  </Box>
                )}
                {errors.gestationOption && (
                  <FormHelperText error>{errors.gestationOption.message}</FormHelperText>
                )}
              </>
            )}
          />
        </Grid>

        {/* 6. Atividade Física */}
        <Grid size={6}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Atividade Física
          </Typography>
          <Controller
            name="physicalActivityOption"
            control={control}
            rules={{ required: 'Selecione o campo' }}
            render={({ field: { onChange, value } }) => (
              <>
                <RadioGroup
                  value={value || ''}
                  onChange={(e) => {
                    onChange(e);
                    setValue('physicalActivity', e.target.value === 'sim' ? '' : 'não');
                  }}
                  row
                >
                  <FormControlLabel value="sim" control={<Radio />} label="Sim" />
                  <FormControlLabel value="não" control={<Radio />} label="Não" />
                </RadioGroup>
                {value === 'sim' && (
                  <Box sx={{ mt: 2 }}>
                    <StyledTextField
                      {...register('physicalActivity', {
                        required: 'Este campo é obrigatório!',
                      })}
                      
                      size="large"
                      label="Qual?"
                      error={errors.physicalActivity ? true : false}
                      helperText={errors.physicalActivity?.message}
                    />
                  </Box>
                )}
                {errors.physicalActivityOption && (
                  <FormHelperText error>{errors.physicalActivityOption.message}</FormHelperText>
                )}
              </>
            )}
          />
        </Grid>

        {/* 7. Problema de Saúde Crônico */}
        <Grid size={{ xs: 6, md: 6 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Problema de Saúde Crônico
          </Typography>
          <Controller
            name="health"
            control={control}
            rules={{ required: 'Selecione o campo' }}
            render={({ field }) => (
              <RadioGroup {...field} row>
                <FormControlLabel value="sim" control={<Radio />} label="Sim" />
                <FormControlLabel value="não" control={<Radio />} label="Não" />
              </RadioGroup>
            )}
          />
          {errors.health && <FormHelperText error>{errors.health.message}</FormHelperText>}
        </Grid>

        {/* 8. Hipertensão */}
        <Grid size={{ xs: 6, md: 6 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Hipertensão
          </Typography>
          <Controller
            name="hypertension"
            control={control}
            rules={{ required: 'Selecione o campo' }}
            render={({ field }) => (
              <RadioGroup {...field} row>
                <FormControlLabel value="sim" control={<Radio />} label="Sim" />
                <FormControlLabel value="não" control={<Radio />} label="Não" />
              </RadioGroup>
            )}
          />
          {errors.hypertension && (
            <FormHelperText error>{errors.hypertension.message}</FormHelperText>
          )}
        </Grid>

        {/* 9. Cardíaco */}
        <Grid size={{ xs: 6, md: 6 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Cardíaco
          </Typography>
          <Controller
            name="cardiac"
            control={control}
            rules={{ required: 'Selecione o campo' }}
            render={({ field }) => (
              <RadioGroup {...field} row>
                <FormControlLabel value="sim" control={<Radio />} label="Sim" />
                <FormControlLabel value="não" control={<Radio />} label="Não" />
              </RadioGroup>
            )}
          />
          {errors.cardiac && <FormHelperText error>{errors.cardiac.message}</FormHelperText>}
        </Grid>

        {/* 10. Cólicas Menstruais */}
        <Grid size={{ xs: 6, md: 6 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Cólicas Menstruais
          </Typography>
          <Controller
            name="cramps"
            control={control}
            rules={{ required: 'Selecione o campo' }}
            render={({ field }) => (
              <RadioGroup {...field} row>
                <FormControlLabel value="sim" control={<Radio />} label="Sim" />
                <FormControlLabel value="não" control={<Radio />} label="Não" />
              </RadioGroup>
            )}
          />
          {errors.cramps && <FormHelperText error>{errors.cramps.message}</FormHelperText>}
        </Grid>

        {/* 11. Cirurgia Recente */}
        <Grid size={{ xs: 6, md: 6 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Cirurgia Recente
          </Typography>
          <Controller
            name="surgery"
            control={control}
            rules={{ required: 'Selecione o campo' }}
            render={({ field }) => (
              <RadioGroup {...field} row>
                <FormControlLabel value="sim" control={<Radio />} label="Sim" />
                <FormControlLabel value="não" control={<Radio />} label="Não" />
              </RadioGroup>
            )}
          />
          {errors.surgery && <FormHelperText error>{errors.surgery.message}</FormHelperText>}
        </Grid>

        {/* 12. Dores na Coluna */}
        <Grid size={6}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Dores na Coluna
          </Typography>
          <Controller
            name="painOption"
            control={control}
            rules={{ required: 'Selecione o campo' }}
            render={({ field: { onChange, value } }) => (
              <>
                <RadioGroup
                  value={value || ''}
                  onChange={(e) => {
                    onChange(e);
                    setValue('pain', e.target.value);
                  }}
                  row
                >
                  <FormControlLabel value="sim" control={<Radio />} label="Sim" />
                  <FormControlLabel value="não" control={<Radio />} label="Não" />
                </RadioGroup>
                {value === 'sim' && (
                  <Box sx={{ mt: 2 }}>
                    <StyledTextField
                      {...register('painEVA', {
                        required: 'Este campo é obrigatório!',
                      })}
                      
                      size="large"
                      label="EVA (Escala Visual Analógica)"
                      error={errors.painEVA ? true : false}
                      helperText={errors.painEVA?.message}
                    />
                  </Box>
                )}
                {errors.painOption && (
                  <FormHelperText error>{errors.painOption.message}</FormHelperText>
                )}
              </>
            )}
          />
        </Grid>

        {/* 13. Perda Urinária */}
        <Grid size={6}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Perda Urinária
          </Typography>
          <Controller
            name="urinaryOption"
            control={control}
            rules={{ required: 'Selecione o campo' }}
            render={({ field: { onChange, value } }) => (
              <>
                <RadioGroup
                  value={value || ''}
                  onChange={(e) => {
                    onChange(e);
                    setValue('urinary', e.target.value);
                  }}
                  row
                >
                  <FormControlLabel value="sim" control={<Radio />} label="Sim" />
                  <FormControlLabel value="não" control={<Radio />} label="Não" />
                </RadioGroup>
                {value === 'sim' && (
                  <Box sx={{ mt: 2 }}>
                    <StyledFormControl  size="large" error={errors.urinaryCorrection ? true : false}>
                      <InputLabel>Correção</InputLabel>
                      <Select
                        {...register('urinaryCorrection', {
                          required: 'Selecione o campo',
                        })}
                        label="Correção"
                        defaultValue=""
                      >
                        <MenuItem value="corrigir">Corrigir</MenuItem>
                        <MenuItem value="não corrigir">Não Corrigir</MenuItem>
                      </Select>
                      {errors.urinaryCorrection && (
                        <FormHelperText>{errors.urinaryCorrection.message}</FormHelperText>
                      )}
                    </StyledFormControl>
                  </Box>
                )}
                {errors.urinaryOption && (
                  <FormHelperText error>{errors.urinaryOption.message}</FormHelperText>
                )}
              </>
            )}
          />
        </Grid>

        {/* 14. Hérnia Abdominal */}
        <Grid size={6}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Hérnia Abdominal
          </Typography>
          <Controller
            name="herniaOption"
            control={control}
            rules={{ required: 'Selecione o campo' }}
            render={({ field: { onChange, value } }) => (
              <>
                <RadioGroup
                  value={value || ''}
                  onChange={(e) => {
                    onChange(e);
                    setValue('hernia', e.target.value);
                  }}
                  row
                >
                  <FormControlLabel value="sim" control={<Radio />} label="Sim" />
                  <FormControlLabel value="não" control={<Radio />} label="Não" />
                </RadioGroup>
                {value === 'sim' && (
                  <Box sx={{ mt: 2 }}>
                    <StyledFormControl  size="large" error={errors.herniaCorrection ? true : false}>
                      <InputLabel>Correção</InputLabel>
                      <Select
                        {...register('herniaCorrection', {
                          required: 'Selecione o campo',
                        })}
                        label="Correção"
                        defaultValue=""
                      >
                        <MenuItem value="corrigir">Corrigir</MenuItem>
                        <MenuItem value="não corrigir">Não Corrigir</MenuItem>
                      </Select>
                      {errors.herniaCorrection && (
                        <FormHelperText>{errors.herniaCorrection.message}</FormHelperText>
                      )}
                    </StyledFormControl>
                  </Box>
                )}
                {errors.herniaOption && (
                  <FormHelperText error>{errors.herniaOption.message}</FormHelperText>
                )}
              </>
            )}
          />
        </Grid>

        {/* Step 3 - Campos */}
        
        {/* 15. Competência Abdominal */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Competência Abdominal
          </Typography>
          <Controller
            name="competence"
            control={control}
            rules={{ required: 'Selecione o campo' }}
            render={({ field }) => (
              <RadioGroup {...field} row>
                <FormControlLabel value="muito pouco" control={<Radio />} label="Muito pouco" />
                <FormControlLabel value="algum" control={<Radio />} label="Algum" />
                <FormControlLabel value="bastante" control={<Radio />} label="Bastante" />
                <FormControlLabel value="muito" control={<Radio />} label="Muito" />
              </RadioGroup>
            )}
          />
          {errors.competence && (
            <FormHelperText error>{errors.competence.message}</FormHelperText>
          )}
        </Grid>

        {/* 16. Tonicidade em Repouso */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Tonicidade em Repouso
          </Typography>
          <Controller
            name="restTone"
            control={control}
            rules={{ required: 'Selecione o campo' }}
            render={({ field }) => (
              <RadioGroup {...field} row>
                <FormControlLabel value="muito pouco" control={<Radio />} label="Muito pouco" />
                <FormControlLabel value="algum" control={<Radio />} label="Algum" />
                <FormControlLabel value="bastante" control={<Radio />} label="Bastante" />
                <FormControlLabel value="muito" control={<Radio />} label="Muito" />
              </RadioGroup>
            )}
          />
          {errors.restTone && <FormHelperText error>{errors.restTone.message}</FormHelperText>}
        </Grid>

        {/* 17. Tonicidade Dinâmica */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Tonicidade Dinâmica
          </Typography>
          <Controller
            name="dynamicTonicity"
            control={control}
            rules={{ required: 'Selecione o campo' }}
            render={({ field }) => (
              <RadioGroup {...field} row>
                <FormControlLabel value="muito pouco" control={<Radio />} label="Muito pouco" />
                <FormControlLabel value="algum" control={<Radio />} label="Algum" />
                <FormControlLabel value="bastante" control={<Radio />} label="Bastante" />
                <FormControlLabel value="muito" control={<Radio />} label="Muito" />
              </RadioGroup>
            )}
          />
          {errors.dynamicTonicity && (
            <FormHelperText error>{errors.dynamicTonicity.message}</FormHelperText>
          )}
        </Grid>

        {/* 18. Cúpula Diafragmática */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Cúpula Diafragmática
          </Typography>
          <Controller
            name="domeDiaphragmatic"
            control={control}
            rules={{ required: 'Selecione o campo' }}
            render={({ field }) => (
              <RadioGroup {...field} row>
                <FormControlLabel value="muito pouco" control={<Radio />} label="Muito pouco" />
                <FormControlLabel value="algum" control={<Radio />} label="Algum" />
                <FormControlLabel value="bastante" control={<Radio />} label="Bastante" />
                <FormControlLabel value="muito" control={<Radio />} label="Muito" />
              </RadioGroup>
            )}
          />
          {errors.domeDiaphragmatic && (
            <FormHelperText error>{errors.domeDiaphragmatic.message}</FormHelperText>
          )}
        </Grid>

        {/* 19. Diástase */}
        <Grid size={12}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Diástase
          </Typography>
          <Controller
            name="diastasis"
            control={control}
            rules={{ required: 'Selecione o campo' }}
            render={({ field }) => (
              <RadioGroup {...field} row>
                <FormControlLabel value="sim" control={<Radio />} label="Sim" />
                <FormControlLabel value="não" control={<Radio />} label="Não" />
              </RadioGroup>
            )}
          />
          {errors.diastasis && <FormHelperText error>{errors.diastasis.message}</FormHelperText>}
        </Grid>

        {/* 20. Supra Abdominal */}
        <Grid size={{ xs: 12, md: 6 }}>
          <StyledTextField
            {...register('supraAbdominal', {
              required: 'Esse campo é obrigatório!',
              min: { value: 1, message: 'O valor deve ser maior que zero!' },
              valueAsNumber: true,
            })}
            fullWidth
            size="large"
            type="number"
            inputMode="numeric"
            label="Supra Abdominal"
            error={errors.supraAbdominal ? true : false}
            helperText={errors.supraAbdominal?.message}
          />
        </Grid>

        {/* 21. Cintura */}
        <Grid size={{ xs: 12, md: 6 }}>
          <StyledTextField
            {...register('waist', {
              required: 'Esse campo é obrigatório!',
              min: { value: 1, message: 'O valor deve ser maior que zero!' },
              valueAsNumber: true,
            })}
            fullWidth
            size="large"
            type="number"
            inputMode="numeric"
            label="Cintura"
            error={errors.waist ? true : false}
            helperText={errors.waist?.message}
          />
        </Grid>

        {/* 22. Umbigo */}
        <Grid size={{ xs: 12, md: 6 }}>
          <StyledTextField
            {...register('bellyButton', {
              required: 'Esse campo é obrigatório!',
              min: { value: 1, message: 'O valor deve ser maior que zero!' },
              valueAsNumber: true,
            })}
            fullWidth
            size="large"
            type="number"
            inputMode="numeric"
            label="Umbigo"
            error={errors.bellyButton ? true : false}
            helperText={errors.bellyButton?.message}
          />
        </Grid>

        {/* 23. Infra Abdominal */}
        <Grid size={{ xs: 12, md: 6 }}>
          <StyledTextField
            {...register('infraAbdominal', {
              required: 'Esse campo é obrigatório!',
              min: { value: 1, message: 'O valor deve ser maior que zero!' },
              valueAsNumber: true,
            })}
            fullWidth
            size="large"
            type="number"
            inputMode="numeric"
            label="Infra Abdominal"
            error={errors.infraAbdominal ? true : false}
            helperText={errors.infraAbdominal?.message}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default FormAnamnese;

