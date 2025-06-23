import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';
import Button from '../atoms/Button';

const ErrorState = ({ 
  message = "Something went wrong", 
  onRetry,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ApperIcon name="AlertTriangle" size={32} className="text-red-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-surface-900 mb-2">Error</h3>
      <p className="text-surface-600 mb-6 max-w-sm mx-auto">{message}</p>
      
      {onRetry && (
        <Button variant="outline" onClick={onRetry} icon="RefreshCw">
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;