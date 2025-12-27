export default defineNuxtRouteMiddleware((to, from) => {
  const { token } = useAuth()
  // If user is logged in, kick them out of login page to home
  if (token.value) {
    return navigateTo('/')
  }
})