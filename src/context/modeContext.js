 
'use client';  

import React, { createContext, useContext, useState } from 'react';

 
const modeContext = createContext({
   mode: null,
   setMode: () => {},
});

 
export const  useMode = () => useContext(modeContext);

 
export const ModeProvider = ({ children }) => {
  const [mode, setMode] = useState({ mode: 'default' });

   
  const value = {
     mode,
    setMode,
  };

  return <modeContext.Provider value={value}>{children}</modeContext.Provider>;
};
