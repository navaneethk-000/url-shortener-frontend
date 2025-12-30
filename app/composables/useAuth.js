export const useAuth = () => {
    const tokenCookie = useCookie('auth_token')
    const token = useState('auth_token_state', () => null)
    const user = useState('auth_user', () => null)
    const config = useRuntimeConfig()

    // Helper to decode token and set user state
    const restoreUser = () => {
        if (token.value && !user.value) {
            try {
                const base64Url = token.value.split('.')[1]
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
                const payload = JSON.parse(window.atob(base64))
                
                user.value = { 
                    email: payload.email, 
                    id: payload.user_id, 
                    name: payload.name 
                }
            } catch (e) {
                token.value = null
                tokenCookie.value = null
            }
        }
    }

    // Run on client mount
    if (process.client) {
        if (!token.value && tokenCookie.value) {
            token.value = tokenCookie.value
        }
        restoreUser()
    }

    // Watch for cookie changes
    watch(tokenCookie, (newVal) => {
        token.value = newVal
        if (process.client) restoreUser()
    })

    // --- ACTIONS ---

    const login = async (email, password) => {
        const { data, error } = await useFetch(`${config.public.apiBase}/api/login`, {
            method: 'POST',
            body: { email, password }
        })

        if (error.value) throw error.value

        tokenCookie.value = data.value.token
        token.value = data.value.token
        
        // Decode immediately for instant UI update
        const base64Url = data.value.token.split('.')[1]
        const payload = JSON.parse(window.atob(base64Url.replace(/-/g, '+').replace(/_/g, '/')))
        
        user.value = { 
            email: payload.email,
            id: payload.user_id,
            name: payload.name
        }
        return true
    }

    const register = async (name, email, password) => {
        const { error } = await useFetch(`${config.public.apiBase}/api/register`, {
            method: 'POST',
            body: { name, email, password }
        })
        if (error.value) throw error.value
        return true
    }

    const logout = () => {
        token.value = null
        tokenCookie.value = null
        user.value = null
        navigateTo('/login')
    }

    return { token, user, login, register, logout }
}