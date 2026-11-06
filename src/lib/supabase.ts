import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * 환경 변수가 없으면 null. 이때 앱은 로그인 없이 로컬 모드로만 동작한다.
 * 모든 데이터 접근이 브라우저에서 일어나므로 서버 클라이언트 없이 PKCE 흐름만 쓴다.
 */
export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: { flowType: 'pkce', persistSession: true, detectSessionInUrl: true },
      })
    : null;

export const PHOTO_BUCKET = 'photos';
