
import { RepresentativeRow } from '@/types/representative';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRow = (row: any, index: number): RepresentativeRow => {
  const errors: string[] = [];
  
  // Verificar campos obrigatórios
  if (!row.name || typeof row.name !== 'string' || row.name.trim() === '') {
    errors.push('Nome é obrigatório');
  }
  
  if (!row.email || typeof row.email !== 'string' || row.email.trim() === '') {
    errors.push('Email é obrigatório');
  } else if (!validateEmail(row.email.trim())) {
    errors.push('Email deve ter um formato válido');
  }
  
  if (!row.phone || typeof row.phone !== 'string' || row.phone.trim() === '') {
    errors.push('Telefone é obrigatório');
  }
  
  if (!row.state || typeof row.state !== 'string' || row.state.trim() === '') {
    errors.push('Estado é obrigatório');
  }
  
  if (!row.region || typeof row.region !== 'string' || row.region.trim() === '') {
    errors.push('Região é obrigatória');
  }

  return {
    name: row.name?.toString().trim() || '',
    email: row.email?.toString().trim() || '',
    phone: row.phone?.toString().trim() || '',
    state: row.state?.toString().trim() || '',
    region: row.region?.toString().trim() || '',
    rowIndex: index + 2, // +2 porque Excel começa em 1 e tem header
    isValid: errors.length === 0,
    errors
  };
};
