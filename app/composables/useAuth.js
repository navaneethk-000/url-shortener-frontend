export const useAuth = () => {
    const token = useCookie('auth_token')
    const user = useState('auth_user', () => null)
    const config = useRuntimeConfig()

    if (token.value && !user.value) {
        try {
            // Simple JWT decode to get email
            const payload = JSON.parse(atob(token.value.split('.')[1]))
            user.value = { email: payload.email }
        } catch (e) {
            // Token invalid
            token.value = null
        }
    }
  
    // Register
    const register = async (email, password) => {

        console.log("API BASE:", config.public.apiBase) 
        
        const { error } = await useFetch(`${config.public.apiBase}/api/register`, {
            method: 'POST',
            body: { email, password }
        })
        if (error.value) throw error.value
        return true
    }
  
    // Login
    const login = async (email, password) => {
        const { data, error } = await useFetch(`${config.public.apiBase}/api/login`, {
            method: 'POST',
            body: { email, password }
        })
  
        if (error.value) throw error.value
  
        // Save Token
        token.value = data.value.token

        // Save email for Avatar
        user.value = { email: data.value.email } 
    
        return true
    }
  
    // Logout
    const logout = () => {
        token.value = null
        user.value = null
        navigateTo('/login')
    }
  
    return { token, user, login, register, logout }
}