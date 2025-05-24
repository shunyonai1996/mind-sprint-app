import { useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export const useTestFetch = () => {
    useEffect(() => {
        const fetchData = async () => {
        const { data, error } = await supabase.from('test_messages').select('*')
        if (error) {
            console.error('Supabase fetch error:', error.message)
        } else {
            console.log('Supabase data:', data)
        }
        }

        fetchData()
    }, [])
}
