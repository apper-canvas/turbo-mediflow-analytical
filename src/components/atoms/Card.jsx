import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  onClick,
  padding = 'default',
  ...props 
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8'
  };

  const baseClasses = `
    bg-white rounded-lg border border-surface-200 shadow-sm
    ${paddings[padding]}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `.trim();

  if (hover || onClick) {
    return (
      <motion.div
        whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
        transition={{ duration: 0.2 }}
        className={baseClasses}
        onClick={onClick}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default Card;