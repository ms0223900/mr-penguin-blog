
import { createClient } from '@supabase/supabase-js'
import { HistoryItem } from '../types'

const supabaseUrl = 'https://djliftabytorrakmwkoa.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

async function fetchAccountingData() {
    let { data: ACCOUNTING, error } = await supabase
        .from('ACCOUNTING')
        .select()

    if (error) {
        console.error(error)
    }

    return ACCOUNTING
}

async function updateAccountingData(item: HistoryItem) {
    const { data, error } = await supabase
        .from('ACCOUNTING')
        .update({
            amount: item.amount,
            category: item.category,
        })
        .eq('id', item.id)

    if (error) {
        console.error('Error updating accounting data:', error)
        throw error
    }

    return data
}
