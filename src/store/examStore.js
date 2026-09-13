import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useExamStore = create((set, get) => ({
  exams: [],
  loading: false,
  error: null,

  fetchExams: async () => {
    set({ loading: true, error: null })
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .order('exam_date', { ascending: true })

    if (error) {
      set({ error: error.message, loading: false })
      return
    }
    set({ exams: data, loading: false })
  },

  addExam: async (exam) => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('exams')
      .insert([{ ...exam, user_id: user.id }])
      .select()
      .single()

    if (error) throw error
    set({ exams: [...get().exams, data].sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date)) })
    return data
  },

  updateExam: async (id, updates) => {
    const { data, error } = await supabase
      .from('exams')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    set({ exams: get().exams.map((e) => (e.id === id ? data : e)) })
    return data
  },

  deleteExam: async (id) => {
    const { error } = await supabase.from('exams').delete().eq('id', id)
    if (error) throw error
    set({ exams: get().exams.filter((e) => e.id !== id) })
  },
}))
