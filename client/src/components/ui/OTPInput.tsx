import { useState, useRef, useEffect } from 'react';

interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (otp: string) => void;
  onComplete?: (otp: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  inputClassName?: string;
}

const OTPInput: React.FC<OTPInputProps> = ({ 
  length = 4, 
  value = '', 
  onChange, 
  onComplete,
  placeholder = '',
  disabled = false,
  autoFocus = false,
  className = '',
  inputClassName = ''
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize OTP from value prop
  useEffect(() => {
    if (value) {
      const otpArray = value.split('').slice(0, length);
      const paddedArray = [...otpArray, ...new Array(length - otpArray.length).fill('')];
      setOtp(paddedArray);
    }
  }, [value, length]);

  // Auto focus first input
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, digit: string) => {
    if (disabled) return;
    
    // Only allow single digit
    if (digit.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Call onChange callback
    const otpString = newOtp.join('');
    if (onChange) {
      onChange(otpString);
    }

    // Call onComplete callback when all fields are filled
    if (onComplete && otpString.length === length && !otpString.includes('')) {
      onComplete(otpString);
    }

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        
        if (onChange) {
          onChange(newOtp.join(''));
        }
      }
    }
    
    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '');
    
    if (pastedData) {
      const pastedArray = pastedData.split('').slice(0, length);
      const newOtp = [...pastedArray, ...new Array(length - pastedArray.length).fill('')];
      setOtp(newOtp);
      
      const otpString = newOtp.join('');
      if (onChange) {
        onChange(otpString);
      }
      
      // Focus the next empty input or last input
      const nextIndex = Math.min(pastedArray.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      
      if (onComplete && otpString.length === length && !otpString.includes('')) {
        onComplete(otpString);
      }
    }
  };

  return (
    <div className={`flex justify-center space-x-2 ${className}`}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => handleChange(index, e.target.value.replace(/\D/g, ''))}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={`w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${inputClassName}`}
        />
      ))}
    </div>
  );
};


export default OTPInput;