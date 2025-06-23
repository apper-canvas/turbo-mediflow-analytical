import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';
import Card from '../atoms/Card';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = 'primary',
  loading = false 
}) => {
  const colors = {
    primary: 'text-primary bg-primary/10',
    secondary: 'text-secondary bg-secondary/10',
    accent: 'text-accent bg-accent/10',
    success: 'text-green-600 bg-green-100',
    warning: 'text-yellow-600 bg-yellow-100',
    danger: 'text-red-600 bg-red-100'
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-surface-500'
  };

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-surface-200 rounded-lg"></div>
            <div className="w-16 h-4 bg-surface-200 rounded"></div>
          </div>
          <div className="w-20 h-8 bg-surface-200 rounded mb-2"></div>
          <div className="w-24 h-4 bg-surface-200 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card hover>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <ApperIcon name={icon} size={24} />
        </div>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColors[trend]}`}>
            <ApperIcon 
              name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
              size={14} 
            />
            {trendValue}
          </div>
        )}
      </div>
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-2xl font-bold text-surface-900 mb-1"
      >
        {value}
      </motion.div>
      
      <p className="text-sm text-surface-600">{title}</p>
    </Card>
  );
};

export default StatCard;