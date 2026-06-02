import { createContext, useState, useEffect } from 'react'

export const SidebarContext = createContext()

export function useSidebar() {
  const context = window.__sidebarContext
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider')
  }
  return context
}

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(true)
  const [isPinned, setIsPinned] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false)
      } else {
        setIsOpen(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => setIsOpen(!isOpen)
  const closeSidebar = () => {
    if (!isPinned) setIsOpen(false)
  }
  const togglePin = () => setIsPinned(!isPinned)

  const value = {
    isOpen,
    toggleSidebar,
    closeSidebar,
    isPinned,
    togglePin,
  }

  // Store en window para acceso global
  window.__sidebarContext = value

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}
