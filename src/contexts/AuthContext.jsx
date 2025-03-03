import React,{createContext, useContext, useState} from 'react'

const AuthContext = createContext();

export function AuthProvider({children}) {

  const [testNumber,setTestNumber] = useState(0);
  const handleTestNumber = () => setTestNumber(prev => prev + 1)
  return (
    <AuthContext.Provider value={{testNumber,setTestNumber,handleTestNumber }}>
      {children}

    </AuthContext.Provider>
  )
}

export function useAuth(){
    const context = useContext(AuthContext);
    if(context === undefined){
        throw new Error("useAuth must be used within a AutoProvider");
    }
    return context;
}

