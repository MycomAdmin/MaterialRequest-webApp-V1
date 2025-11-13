// src/components/ui/StyledComponents.jsx
import { styled } from '@mui/material/styles';
import { Button, Card, Box, Chip } from '@mui/material';
import { customColors } from '../../theme';

export const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.primaryDark} 100%)`,
  color: 'white',
  fontWeight: 600,
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(67, 97, 238, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(67, 97, 238, 0.4)',
    background: `linear-gradient(135deg, ${customColors.primaryDark} 0%, ${customColors.primary} 100%)`
  }
}));

export const MaterialCard = styled(Card)(({ theme }) => ({
  background: 'white',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
  }
}));

export const StatusChip = styled(Chip)(({ status, theme }) => {
  const statusConfig = customColors.status[status] || customColors.status.pending;
  return {
    backgroundColor: statusConfig.background,
    color: statusConfig.color,
    fontWeight: 600,
    fontSize: '0.75rem',
    borderRadius: '9999px',
    padding: '4px 12px',
    height: 'auto'
  };
});

export const GradientBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.secondary} 100%)`,
  color: 'white'
}));

export const StatCard = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: '16px',
  textAlign: 'center'
}));