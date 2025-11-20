import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import { patientsApi } from '@/services/api';
import { useNavigate } from 'react-router-dom';

export default function PatientsPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchTerm, setSearchTerm] = useState('');

  const { data: patients, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: () => patientsApi.getAll().then((res) => res.data),
  });

  const filteredPatients = patients?.filter((patient: any) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      patient.cedula?.toLowerCase().includes(search) ||
      patient.nombre?.toLowerCase().includes(search) ||
      patient.apellido?.toLowerCase().includes(search) ||
      patient.telefono_1?.toLowerCase().includes(search) ||
      patient.ciudad?.toLowerCase().includes(search) ||
      patient.provincia?.toLowerCase().includes(search)
    );
  });

  if (isLoading) {
    return (
      <Box sx={{ width: '100%', p: 2 }}>
        <Typography>Cargando pacientes...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', p: { xs: 2, sm: 3, md: 4 } }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          mb: 3,
          gap: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Pacientes
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
          <TextField
            placeholder="Buscar pacientes..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: { xs: 1, sm: 'none' }, minWidth: { xs: 'auto', sm: 250 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" sx={{ whiteSpace: 'nowrap' }}>
            Nuevo Paciente
          </Button>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          width: '100%',
          overflowX: 'auto',
        }}
      >
        <Table sx={{ minWidth: 650 }} size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell>Cédula</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                Teléfono
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                Ciudad
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                Provincia
              </TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary" sx={{ py: 3 }}>
                    {searchTerm
                      ? 'No se encontraron pacientes con ese criterio de búsqueda'
                      : 'No hay pacientes disponibles'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredPatients?.map((patient: any) => (
                <TableRow key={patient.patient_id} hover>
                  <TableCell>{patient.cedula}</TableCell>
                  <TableCell>
                    {patient.nombre} {patient.apellido}
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    {patient.telefono_1}
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                    {patient.ciudad || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                    {patient.provincia || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<HistoryIcon />}
                        onClick={() => navigate(`/patients/${patient.patient_id}/history`)}
                      >
                        Historial
                      </Button>
                      <Button size="small" variant="outlined">
                        Editar
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
