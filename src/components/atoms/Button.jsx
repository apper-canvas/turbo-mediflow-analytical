import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-primary text-white hover:brightness-90 focus:ring-primary/50 shadow-sm",
    secondary: "bg-secondary text-white hover:brightness-90 focus:ring-secondary/50 shadow-sm",
    accent: "bg-accent text-white hover:brightness-90 focus:ring-accent/50 shadow-sm",
    outline: "border border-surface-300 text-surface-700 hover:bg-surface-50 focus:ring-surface/50",
    ghost: "text-surface-700 hover:bg-surface-100 focus:ring-surface/50",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/50 shadow-sm"
  };
  
  const sizes = {
    xs: "px-2.5 py-1.5 text-xs",
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.01 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `.trim()}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          size={16} 
          className="animate-spin mr-2" 
        />
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <ApperIcon 
          name={icon} 
          size={16} 
          className={children ? 'mr-2' : ''} 
        />
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && !loading && (
        <ApperIcon 
          name={icon} 
          size={16} 
          className={children ? 'ml-2' : ''} 
        />
      )}
    </motion.button>
  );
};

export default Button;