import Input from '../atoms/Input';

const FormField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  type = 'text',
  required = false,
  placeholder,
  icon,
  disabled = false,
  className = ''
}) => {
  const handleChange = (e) => {
    onChange?.(name, e.target.value);
  };

  return (
    <div className={className}>
      <Input
        label={label}
        type={type}
        value={value}
        onChange={handleChange}
        error={error}
        required={required}
        placeholder={placeholder}
        icon={icon}
        disabled={disabled}
      />
    </div>
  );
};

export default FormField;