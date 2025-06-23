const StatusBadge = ({ status, variant = 'default', size = 'sm' }) => {
  const getStatusStyles = (status) => {
    const statusMap = {
      // Appointment statuses
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      
      // Bill statuses
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      paid: 'bg-green-100 text-green-800 border-green-200',
      overdue: 'bg-red-100 text-red-800 border-red-200',
      
      // General statuses
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      
      // Default
      default: 'bg-surface-100 text-surface-800 border-surface-200'
    };
    
    return statusMap[status] || statusMap.default;
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-sm'
  };

  return (
    <span className={`
      inline-flex items-center font-medium rounded-full border
      ${getStatusStyles(status)}
      ${sizes[size]}
    `.trim()}>
      {status}
    </span>
  );
};

export default StatusBadge;