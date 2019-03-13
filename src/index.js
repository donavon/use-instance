import { useRef } from 'react';

const useInstance = (initialValue = {}) => useRef(initialValue).current;

export default useInstance;
