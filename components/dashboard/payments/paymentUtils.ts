export const formatDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-VE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return dateStr;
  }
};

export const getMethodStyle = (method: string) => {
  switch (method.toLowerCase()) {
    case 'zelle':
      return { label: 'Zelle', bg: 'bg-[#f3e8ff]', text: 'text-[#7e22ce]', dot: 'bg-[#a855f7]' };
    case 'pago_movil':
      return {
        label: 'Pago Móvil',
        bg: 'bg-[#e0f2fe]',
        text: 'text-[#0369a1]',
        dot: 'bg-[#0ea5e9]',
      };
    case 'transferencia':
      return {
        label: 'Transferencia',
        bg: 'bg-[#dbeafe]',
        text: 'text-[#1d4ed8]',
        dot: 'bg-[#3b82f6]',
      };
    case 'efectivo':
      return { label: 'Efectivo', bg: 'bg-[#fef9c3]', text: 'text-[#854d0e]', dot: 'bg-[#eab308]' };
    default:
      return { label: method, bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' };
  }
};

export const getStatusStyle = (status: string) => {
  switch (status) {
    case 'PROCESSING':
      return {
        label: 'Pendiente',
        bg: 'bg-red-50 text-red-700 ring-red-600/10',
        dot: 'bg-red-500 animate-pulse',
      };
    case 'COMPLETED':
      return {
        label: 'Aprobado',
        bg: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
        dot: 'bg-emerald-500',
      };
    case 'REJECTED':
      return {
        label: 'Rechazado',
        bg: 'bg-gray-50 text-gray-700 ring-gray-600/10',
        dot: 'bg-gray-400',
      };
    default:
      return { label: status, bg: 'bg-gray-50 text-gray-600 ring-gray-600/10', dot: 'bg-gray-400' };
  }
};
