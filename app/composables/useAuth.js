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

    const setUserFromToken = (jwtString) => {
        try {
            const base64Url = jwtString.split('.')[1]
            // Convert Base64Url to Base64
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
            // Decode
            const payload = JSON.parse(window.atob(base64))
            
            // SAVE NAME HERE 👇
            user.value = { 
                email: payload.email, 
                id: payload.user_id,
                name: payload.name
            }
        } catch (e) {
            token.value = null
            user.value = null
        }
    }

    if (token.value && !user.value) {
        // If running on client, decode immediately
        if (process.client) {
            setUserFromToken(token.value)
        }
    }
  
    // Register
    const register = async (name, email, password) => {

        console.log("API BASE:", config.public.apiBase) 
        
        const { error } = await useFetch(`${config.public.apiBase}/api/register`, {
            method: 'POST',
            body: { name, email, password }
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
        setUserFromToken(data.value.token) 
    
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