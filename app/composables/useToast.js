export const useToast = () => {
    // Global state to hold active toasts
    const toasts = useState('toasts', () => [])

    const add = (message, type = 'success') => {
        const id = Date.now()
        toasts.value.push({ id, message, type })

        // Auto remove after 3 seconds
        setTimeout(() => {
            remove(id)
        }, 3000)
    }

    const remove = (id) => {
        toasts.value = toasts.value.filter(t => t.id !== id)
    }

    // Helpers
    const success = (msg) => add(msg, 'success')
    const error = (msg) => add(msg, 'error')

    return { toasts, success, error, remove }
}