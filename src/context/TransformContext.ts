import { createContext } from 'react';
import { mat4 } from 'gl-matrix';

export default createContext<mat4>(mat4.create());