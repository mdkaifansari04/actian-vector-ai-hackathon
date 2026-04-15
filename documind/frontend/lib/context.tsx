'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type { AppContext } from './types'

const STORAGE_KEY = 'documind.activeContext'

const defaultContext: AppContext = {
  activeInstanceId: null,
  activeInstanceName: null,
  activeNamespaceId: null,
  activeKbId: null,
  lastUpdatedAt: null,
}

interface AppContextValue extends AppContext {
  setActiveInstance: (id: string, name: string) => void
  setActiveNamespace: (id: string) => void
  setActiveKb: (id: string | null) => void
  clearContext: () => void
  hasContext: boolean
  needsSetup: boolean
}

const AppContextContext = createContext<AppContextValue | null>(null)

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [context, setContext] = useState<AppContext>(defaultContext)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as AppContext
        setContext(parsed)
      }
    } catch (error) {
      console.error('Failed to load context from localStorage:', error)
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(context))
      } catch (error) {
        console.error('Failed to save context to localStorage:', error)
      }
    }
  }, [context, isLoaded])

  const setActiveInstance = useCallback((id: string, name: string) => {
    setContext((prev) => ({
      ...prev,
      activeInstanceId: id,
      activeInstanceName: name,
      activeNamespaceId: null,
      activeKbId: null,
      lastUpdatedAt: new Date().toISOString(),
    }))
  }, [])

  const setActiveNamespace = useCallback((id: string) => {
    setContext((prev) => ({
      ...prev,
      activeNamespaceId: id,
      activeKbId: null,
      lastUpdatedAt: new Date().toISOString(),
    }))
  }, [])

  const setActiveKb = useCallback((id: string | null) => {
    setContext((prev) => ({
      ...prev,
      activeKbId: id,
      lastUpdatedAt: new Date().toISOString(),
    }))
  }, [])

  const clearContext = useCallback(() => {
    setContext(defaultContext)
  }, [])

  const hasContext = !!(context.activeInstanceId && context.activeNamespaceId)
  const needsSetup = isLoaded && !hasContext

  const value: AppContextValue = {
    ...context,
    setActiveInstance,
    setActiveNamespace,
    setActiveKb,
    clearContext,
    hasContext,
    needsSetup,
  }

  // Don't render until loaded to avoid hydration mismatch
  if (!isLoaded) {
    return null
  }

  return (
    <AppContextContext.Provider value={value}>
      {children}
    </AppContextContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContextContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider')
  }
  return context
}
