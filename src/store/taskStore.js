import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null })
    const { data, error } = await supabase
      .from('study_tasks')
      .select('*')
      .order('task_date', { ascending: true })
      .order('start_time', { ascending: true, nullsFirst: false })

    if (error) {
      set({ error: error.message, loading: false })
      return
    }
    set({ tasks: data, loading: false })
  },

  addTask: async (task) => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('study_tasks')
      .insert([{ ...task, user_id: user.id }])
      .select()
      .single()

    if (error) throw error
    set({ tasks: [...get().tasks, data] })
    return data
  },

  updateTask: async (id, updates) => {
    const { data, error } = await supabase
      .from('study_tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    set({ tasks: get().tasks.map((t) => (t.id === id ? data : t)) })
    return data
  },

  updateTaskStatus: async (id, status) => {
    return get().updateTask(id, { status })
  },

  deleteTask: async (id) => {
    const { error } = await supabase.from('study_tasks').delete().eq('id', id)
    if (error) throw error
    set({ tasks: get().tasks.filter((t) => t.id !== id) })
  },
}))
