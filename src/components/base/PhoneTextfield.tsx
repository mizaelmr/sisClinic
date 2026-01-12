import React from 'react';
import { Country } from 'types/countries';
import NumberTextField from './NumberTextField';

interface PhoneTextfieldProps {
  countries?: Country[];
  onChange?: (value: string, event?: React.ChangeEvent<HTMLElement>) => void;
  defaultValue?: {
    number: string;
    code: string;
  };
}

const PhoneTextfield = ({
  onChange,
  defaultValue,
}: PhoneTextfieldProps) => {


  return (
      <NumberTextField
        variant="custom"
        size="large"
        fullWidth
        value={defaultValue?.number}
        onChange={(e) => {
          if (onChange) {
            onChange(`${e.target.value}`, e);
          }
        }}
      />
  );
};

export default PhoneTextfield;
