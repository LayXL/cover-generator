import { createContext, useContext } from "react"

export type AuthContext = {
  token: string
}

const authContext = createContext<AuthContext>({
  token: "",
})

export const useAuth = () => {
  const data = useContext(authContext)

  return {
    ...data,
    authorizationHeader: `Bearer ${data.token}` as const,
  }
}

export const AuthProvider = authContext.Provider
