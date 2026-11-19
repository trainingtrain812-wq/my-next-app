import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://fpiujtgmrjktgwynzy.supabase.co"
// انسخ المفتاح الخاص بك من لوحة تحكم Supabase وضعه هنا بدلاً من النص أدناه
const supabaseAnonKey = "sb_publishable_gjZWcceHCxcLxukMcLb7zQ_VwXgA"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)