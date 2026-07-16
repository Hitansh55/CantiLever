import TaskList from '../components/TaskList'

export default function Pending() {
  return <TaskList fixedStatus="Pending" title="Pending" description="Tasks still waiting to be started." />
}
