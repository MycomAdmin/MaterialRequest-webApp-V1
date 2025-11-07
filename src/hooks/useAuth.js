// src/hooks/useAuth.js
import { useSelector, useDispatch } from 'react-redux'
import { login, logout, updateUser } from '../redux/slices/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)

  const signIn = (userData) => {
    dispatch(login(userData))
  }

  const signOut = () => {
    dispatch(logout())
  }

  const updateProfile = (userData) => {
    dispatch(updateUser(userData))
  }

  return {
    ...auth,
    signIn,
    signOut,
    updateProfile
  }
}