import { useState } from 'react';
import ApperIcon from '../ApperIcon';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasValue = value && value.toString().length > 0;
  const isFloating = focused || hasValue;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400">
            <ApperIcon name={icon} size={16} />
          </div>
        )}
        
        <input
          type={inputType}
          value={value || ''}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          placeholder={!label ? placeholder : ''}
          className={`
            w-full px-3 py-3 border rounded-lg transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${type === 'password' ? 'pr-10' : ''}
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-surface-300 focus:border-primary focus:ring-primary/20'
            }
            ${disabled 
              ? 'bg-surface-50 text-surface-500 cursor-not-allowed' 
              : 'bg-white text-surface-900'
            }
            focus:outline-none focus:ring-2
            ${label ? 'pt-6 pb-2' : ''}
          `.trim()}
          {...props}
        />

        {label && (
          <label className={`
            absolute left-3 transition-all duration-200 pointer-events-none
            ${icon ? 'left-10' : 'left-3'}
            ${isFloating 
              ? 'top-1.5 text-xs text-surface-500' 
              : 'top-1/2 transform -translate-y-1/2 text-surface-600'
            }
            ${error && isFloating ? 'text-red-500' : ''}
            ${focused && !error ? 'text-primary' : ''}
          `.trim()}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
          >
            <ApperIcon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <ApperIcon name="AlertCircle" size={14} />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;