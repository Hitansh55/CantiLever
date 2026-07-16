import { useEffect, useMemo, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import toast from 'react-hot-toast'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'

export function useTasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setTasks([])
      setLoading(false)
      return
    }
    setLoading(true)
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const next = snapshot.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
          }
        })
        setTasks(next)
        setLoading(false)
      },
      (error) => {
        console.error(error)
        toast.error('Could not load tasks.')
        setLoading(false)
      }
    )
    return unsubscribe
  }, [user])

  const addTask = async (task) => {
    if (!user) return
    await addDoc(collection(db, 'tasks'), {
      ...task,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }

  const editTask = async (id, task) => {
    await updateDoc(doc(db, 'tasks', id), {
      ...task,
      updatedAt: serverTimestamp(),
    })
  }

  const removeTask = async (id) => {
    await deleteDoc(doc(db, 'tasks', id))
  }

  const toggleStatus = async (id, status) => {
    await updateDoc(doc(db, 'tasks', id), {
      status,
      updatedAt: serverTimestamp(),
    })
  }

  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.status === 'Completed').length
    const pending = tasks.filter((t) => t.status === 'Pending').length
    const inProgress = tasks.filter((t) => t.status === 'In Progress').length
    return { total, completed, pending, inProgress }
  }, [tasks])

  return { tasks, loading, addTask, editTask, removeTask, toggleStatus, stats }
}
