import { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventIcon from '@mui/icons-material/Event';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import HealingIcon from '@mui/icons-material/Healing';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ScienceIcon from '@mui/icons-material/Science';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PsychologyIcon from '@mui/icons-material/Psychology';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import ChatbotWidget from '../ChatbotWidget/ChatbotWidget';

const drawerWidth = 260;
const drawerWidthCollapsed = 80;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuthStore();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCollapseToggle = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Tickets', icon: <AssignmentIcon />, path: '/tickets' },
    { text: 'Pacientes', icon: <PeopleIcon />, path: '/patients' },
    { text: 'Prestadores', icon: <LocalHospitalIcon />, path: '/providers' },
    { text: 'Eventos', icon: <EventIcon />, path: '/eventos' },
    { text: 'Encuentros', icon: <MeetingRoomIcon />, path: '/encuentros' },
    { text: 'Enfermería', icon: <HealingIcon />, path: '/enfermeria' },
    { text: 'Transporte', icon: <DirectionsCarIcon />, path: '/transporte' },
    { text: 'Estudios', icon: <ScienceIcon />, path: '/estudios' },
    { text: 'Nutrición', icon: <RestaurantIcon />, path: '/nutricion' },
    { text: 'Psicología', icon: <PsychologyIcon />, path: '/psicologia' },
  ];

  const currentDrawerWidth = collapsed ? drawerWidthCollapsed : drawerWidth;

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar
        sx={{
          minHeight: '64px !important',
          px: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: collapsed ? 0 : 2,
        }}
      >
        {collapsed ? (
          <Box
            component="img"
            src="/logo-image.png"
            alt="Concierge"
            sx={{
              width: 40,
              height: 40,
              objectFit: 'contain',
            }}
          />
        ) : (
          <>
            <Box
              component="img"
              src="/logo-width.png"
              alt="Concierge"
              sx={{
                height: 40,
                width: 'auto',
                objectFit: 'contain',
              }}
            />
          </>
        )}
      </Toolbar>
      <Divider />
      {!isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton
            onClick={handleCollapseToggle}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>
      )}
      <List sx={{ flexGrow: 1, pt: 1 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isSelected}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  px: collapsed ? 1 : 2,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                }}
                title={collapsed ? item.text : ''}
              >
                <ListItemIcon
                  sx={{
                    color: isSelected ? (collapsed ? 'white' : 'white') : 'inherit',
                    minWidth: collapsed ? 0 : 40,
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { md: `${currentDrawerWidth}px` },
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 500 }}
          >
            Plataforma Concierge MINSEG
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Notificaciones */}
            <IconButton color="inherit" size="large">
              <Badge badgeContent={0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* Perfil de Usuario */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
              onClick={handleMenuOpen}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: 'primary.main',
                  fontSize: '0.875rem',
                }}
              >
                {user?.nombre?.charAt(0) || 'U'}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" fontWeight={500}>
                  {user?.nombre || 'Usuario'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.role || 'Rol'}
                </Typography>
              </Box>
            </Box>

            {/* Menu Dropdown */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 250,
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body1" fontWeight={600}>
                  {user?.nombre || 'Usuario'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email || ''}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {user?.role || 'Rol'}
                </Typography>
              </Box>
              <MenuItem onClick={handleLogout} sx={{ gap: 1 }}>
                <LogoutIcon fontSize="small" />
                Cerrar Sesión
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { md: currentDrawerWidth },
          flexShrink: { md: 0 },
        }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: currentDrawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: '100%', md: `calc(100% - ${currentDrawerWidth}px)` },
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: '#f5f5f5',
          overflow: 'auto',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {children}
      </Box>

      {/* Chatbot Widget */}
      <ChatbotWidget />
    </Box>
  );
}
