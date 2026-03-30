import React from 'react';
import {
  TextField,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import { countries, Country } from '../../types';

interface CountrySelectorProps {
  value: string;
  onChange: (dialCode: string) => void;
  error?: boolean;
  helperText?: string;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onChange,
  error,
  helperText,
}) => {
  return (
    <TextField
      select
      label="Country"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      helperText={helperText}
      fullWidth
      required
    >
      {countries.map((country) => (
        <MenuItem key={country.code} value={country.dialCode}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1">{country.flag}</Typography>
            <Typography variant="body2">
              {country.name} ({country.dialCode})
            </Typography>
          </Box>
        </MenuItem>
      ))}
    </TextField>
  );
};
