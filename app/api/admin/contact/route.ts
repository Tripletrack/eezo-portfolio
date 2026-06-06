import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function authorized(req: NextRequest) {
  const pw = req.headers.get('x-admin-password')
  return pw === process.env.ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data, error } = await getAdmin().from('site_config').select('*')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const config: Record<string, string> = {}
  for (const row of data) config[row.key] = row.value
  return NextResponse.json(config)
}

export async function PUT(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const supabase = getAdmin()
  const updates = Object.entries(body).map(([key, value]) =>
    supabase.from('site_config').upsert({ key, value }).eq('key', key)
  )
  await Promise.all(updates)
  return NextResponse.json({ success: true })
}
