import { useEffect, useState } from 'react'
import './App.css'
import Login from './pages/Login';
import Home from './pages/Home';
import { UserContext } from './context/UserContext';

function App() {
  //context api state
  const [token, setToken] = useState<null | string>(null);
  const [tenantId, setTenantId] = useState<null | string>(null);

  //context api methods
  function updateTokenAndTenantId(token: string | null, tenantId:string | null){
    if(token){
      localStorage.setItem("token", token);
    }else{
      localStorage.removeItem("token");
    }
    if(tenantId){
      localStorage.setItem("tenantId", tenantId);
    }else{
      localStorage.removeItem("tenantId");
    }
    setToken(token);
    setTenantId(tenantId);
  }

  useEffect(()=>{
    const localToken = localStorage.getItem("token");
    const localTenantId = localStorage.getItem("tenantId");
    if(localToken){
      setToken(localToken);
    }
    if(localTenantId){
      setTenantId(localTenantId);
    }
    
  }, [])

  return (
  <UserContext.Provider value={{token, tenantId, updateTokenAndTenantId}}>
    {token && tenantId ? <Home/>:<Login/>}
  </UserContext.Provider>
  )
}

export default App
