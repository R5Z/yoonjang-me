import { supabase } from '../src/supabaseClient'

export async function getCommentCounts() {
  const { data, error } = await supabase.from('comments').select('post_id')

  if (error) {
    console.error('댓글 개수 조회 실패:', error)
    return {}
  }

  return data.reduce((counts, row) => {
    counts[row.post_id] = (counts[row.post_id] || 0) + 1
    return counts
  }, {})
}