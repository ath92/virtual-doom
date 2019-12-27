import { createContext } from 'react';
// which intersectable uid we're looking at
export default createContext<string | null>(null);