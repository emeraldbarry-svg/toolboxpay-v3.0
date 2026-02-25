import { supabase } from '../supabase/supabaseClient'

export const db = {
  // Save a new customer to the directory
  async addCustomer(name: string, phone: string, address: string) {
    const { data, error } = await supabase
      .from('customers')
      .insert([{ name, phone, address }])
    if (error) console.error('Error adding customer:', error.message)
    return { data, error }
  },

  // Fetch all customers for the directory
  async getCustomers() {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('name', { ascending: true })
    return { data, error }
  },

  // Save a job quote with the photo URL
  async saveQuote(quoteData: any) {
    const { data, error } = await supabase
      .from('quotes')
      .insert([quoteData])
    return { data, error }
  }
}
