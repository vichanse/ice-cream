import { useEffect, useState } from 'react';

const useValidation = (value, validatorFn, compareValue = null) => {
  const [error, setError] = useState('');

  useEffect(() => {
    setError(validatorFn(value, compareValue));
  }, [value, validatorFn, compareValue]);
};

export default useValidation;
