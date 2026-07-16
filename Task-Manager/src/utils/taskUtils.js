export const PRIORITIES = ['Low', 'Medium', 'High']
export const STATUSES = ['Pending', 'In Progress', 'Completed']
export const CATEGORIES = ['Work', 'Personal', 'Study', 'Health', 'Finance', 'Other']

export const PRIORITY_STYLES = {
  Low: 'bg-accent/10 text-accent-dark dark:text-accent-light border border-accent/20',
  Medium: 'bg-amber/15 text-amber border border-amber/30',
  High: 'bg-rose/10 text-rose border border-rose/30',
}

export const STATUS_STYLES = {
  Pending: 'bg-ledger-mutedLight/10 text-ledger-mutedLight border border-ledger-mutedLight/25',
  'In Progress': 'bg-amber/15 text-amber border border-amber/30',
  Completed: 'bg-accent/10 text-accent-dark dark:text-accent-light border border-accent/20',
}

export const STATUS_BAR_COLOR = {
  Low: '#1E7F72',
  Medium: '#E8A33D',
  High: '#C1554A',
}

export function filterTasks(tasks, { search, status, priority, category, dueDate }) {
  return tasks.filter((task) => {
    if (search && !task.title?.toLowerCase().includes(search.toLowerCase())) return false
    if (status && task.status !== status) return false
    if (priority && task.priority !== priority) return false
    if (category && task.category !== category) return false
    if (dueDate && task.dueDate !== dueDate) return false
    return true
  })
}

export function sortTasks(tasks, sortBy) {
  const priorityRank = { High: 0, Medium: 1, Low: 2 }
  const sorted = [...tasks]
  switch (sortBy) {
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    case 'dueDate':
      return sorted.sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0))
    case 'priority':
      return sorted.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority])
    case 'alphabetical':
      return sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    case 'newest':
    default:
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
}

export function formatDate(dateLike) {
  if (!dateLike) return 'No due date'
  const d = new Date(dateLike)
  if (Number.isNaN(d.getTime())) return dateLike
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}
