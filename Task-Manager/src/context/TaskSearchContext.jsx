import { createContext, useContext } from 'react'

export const TaskSearchContext = createContext({ search: '', setSearch: () => {} })

export function useTaskSearch() {
  return useContext(TaskSearchContext)
}
