import { useEffect, useState } from 'react';

const useValidation = (value, validatorFn, compareValue = null) => {
  const [error, setError] = useState('');

  useEffect(() => {
    setError(validatorFn(value, compareValue));
  }, [value, validatorFn, compareValue]);

  return error;
};

export default useValidation;
