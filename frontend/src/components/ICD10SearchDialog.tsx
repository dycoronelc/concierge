import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { icd10Api } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

interface ICD10 {
  icd10_id: string;
  codigo: string;
  descripcion: string;
  descripcion_completa?: string;
  categoria?: string;
}

interface ICD10SearchDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (icd10: ICD10) => void;
  title?: string;
}

export default function ICD10SearchDialog({
  open,
  onClose,
  onSelect,
  title = 'Buscar Diagnóstico ICD-10',
}: ICD10SearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { data: results, isLoading, refetch } = useQuery({
    queryKey: ['icd10-search', searchTerm],
    queryFn: () => icd10Api.search(searchTerm, 20).then((res) => res.data),
    enabled: searchTerm.length >= 2,
  });

  useEffect(() => {
    if (open) {
      setSearchTerm('');
      setSelectedIndex(null);
    }
  }, [open]);

  const handleSelect = (icd10: ICD10) => {
    onSelect(icd10);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' && results && selectedIndex !== null && selectedIndex < results.length - 1) {
      e.preventDefault();
      setSelectedIndex(selectedIndex + 1);
    } else if (e.key === 'ArrowUp' && selectedIndex !== null && selectedIndex > 0) {
      e.preventDefault();
      setSelectedIndex(selectedIndex - 1);
    } else if (e.key === 'Enter' && selectedIndex !== null && results) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          autoFocus
          placeholder="Buscar por código o descripción (mínimo 2 caracteres)..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelectedIndex(null);
          }}
          onKeyDown={handleKeyDown}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {!isLoading && searchTerm.length >= 2 && results && results.length === 0 && (
          <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
            No se encontraron diagnósticos
          </Typography>
        )}

        {!isLoading && searchTerm.length < 2 && (
          <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
            Escribe al menos 2 caracteres para buscar
          </Typography>
        )}

        {!isLoading && results && results.length > 0 && (
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {results.map((icd10: ICD10, index: number) => (
              <ListItem key={icd10.icd10_id} disablePadding>
                <ListItemButton
                  selected={selectedIndex === index}
                  onClick={() => handleSelect(icd10)}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Typography variant="body1" fontWeight="bold">
                          {icd10.codigo}
                        </Typography>
                        {icd10.categoria && (
                          <Typography variant="caption" color="text.secondary">
                            ({icd10.categoria})
                          </Typography>
                        )}
                      </Box>
                    }
                    secondary={icd10.descripcion_completa || icd10.descripcion}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
}

