import { createContext, useContext } from "react";

type UserContextType = {
    token: string | null;
    tenantId: string | null;
    updateTokenAndTenantId: (token: string | null, tenantId: string | null) => void;
};

export const UserContext = createContext<UserContextType>({
    token: null,
    tenantId: null,
    updateTokenAndTenantId: () => {},
});

export default function useUserContext(){
    return useContext(UserContext);
}