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
  Chip,
  Button,
  TextField,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { providersApi } from '@/services/api';

export default function ProvidersPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchTerm, setSearchTerm] = useState('');

  const { data: providers, isLoading } = useQuery({
    queryKey: ['providers'],
    queryFn: () => providersApi.getAll().then((res) => res.data),
  });

  const filteredProviders = providers?.filter((provider: any) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      provider.nombre?.toLowerCase().includes(search) ||
      provider.tipo?.toLowerCase().includes(search) ||
      provider.categorias?.some((cat: string) => cat.toLowerCase().includes(search)) ||
      provider.ciudades?.some((city: string) => city.toLowerCase().includes(search)) ||
      provider.provincias?.some((prov: string) => prov.toLowerCase().includes(search))
    );
  });

  if (isLoading) {
    return (
      <Box sx={{ width: '100%', p: 2 }}>
        <Typography>Cargando prestadores...</Typography>
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
          Prestadores
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
          <TextField
            placeholder="Buscar prestadores..."
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
            Nuevo Prestador
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
              <TableCell>Nombre</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                Categorías
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                Ciudades
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                Disponible
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                Carga Actual
              </TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProviders?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary" sx={{ py: 3 }}>
                    {searchTerm
                      ? 'No se encontraron prestadores con ese criterio de búsqueda'
                      : 'No hay prestadores disponibles'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredProviders?.map((provider: any) => (
                <TableRow key={provider.provider_id} hover>
                  <TableCell>{provider.nombre}</TableCell>
                  <TableCell>
                    <Chip
                      label={provider.tipo}
                      color={provider.tipo === 'Aliado' ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 200,
                      }}
                    >
                      {provider.categorias?.join(', ') || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 200,
                      }}
                    >
                      {provider.ciudades?.slice(0, 2).join(', ') || 'N/A'}
                      {provider.ciudades?.length > 2 && '...'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    <Chip
                      label={provider.disponible ? 'Sí' : 'No'}
                      color={provider.disponible ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    {provider.carga_trabajo_actual}
                  </TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined">
                      Editar
                    </Button>
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
