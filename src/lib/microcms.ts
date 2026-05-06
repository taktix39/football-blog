// src/lib/microcms.ts
// microCMS APIクライアント

import type { Match, MicroCMSListResponse } from '../types/microcms'

const BASE_URL = import.meta.env.MICROCMS_BASE_URL   // e.g. https://xxx.microcms.io
const API_KEY  = import.meta.env.MICROCMS_API_KEY

if (!BASE_URL || !API_KEY) {
  throw new Error('MICROCMS_BASE_URL and MICROCMS_API_KEY must be set in .env')
}

const headers = { 'X-MICROCMS-API-KEY': API_KEY }

// ── 一覧取得 ────────────────────────────────────────────────
export async function getMatches(opts?: {
  league?: string
  limit?: number
  offset?: number
}): Promise<MicroCMSListResponse<Match>> {
  const params = new URLSearchParams({
    limit:  String(opts?.limit  ?? 100),
    offset: String(opts?.offset ?? 0),
    orders: '-matchDate',
  })

  if (opts?.league && opts.league !== 'all') {
    // microCMSのセレクトフィールドはcontainsでフィルタできる
    params.set('filters', `league[contains]${opts.league}`)
  }

  const res = await fetch(
    `${BASE_URL}/api/v1/blog?${params}`,
    { headers }
  )

  if (!res.ok) throw new Error(`microCMS error: ${res.status}`)
  return res.json()
}

// ── 単件取得 ────────────────────────────────────────────────
export async function getMatch(id: string): Promise<Match> {
  const res = await fetch(
    `${BASE_URL}/api/v1/blog/${id}`,
    { headers }
  )
  if (!res.ok) throw new Error(`microCMS error: ${res.status} for id=${id}`)
  return res.json()
}

// ── 全ID取得（静的ビルド用） ────────────────────────────────
export async function getAllMatchIds(): Promise<string[]> {
  const data = await getMatches({ limit: 100 })
  return data.contents.map(m => m.id)
}

// ── 統計データ生成 ──────────────────────────────────────────
export function buildStats(matches: Match[]) {
  const total = matches.length

  // リーグ別集計
  const leagueCounts: Record<string, number> = {}
  for (const m of matches) {
    const l = m.league?.[0]?.id ?? 'other'
    leagueCounts[l] = (leagueCounts[l] ?? 0) + 1
  }

  // 月別集計
  const monthCounts: Record<string, number> = {}
  for (const m of matches) {
    const month = m.matchDate?.slice(0, 7) ?? m.publishedAt.slice(0, 7)
    monthCounts[month] = (monthCounts[month] ?? 0) + 1
  }

  // 最多登場クラブ
  const clubCounts: Record<string, number> = {}
  for (const m of matches) {
    clubCounts[m.homeTeam] = (clubCounts[m.homeTeam] ?? 0) + 1
    clubCounts[m.awayTeam] = (clubCounts[m.awayTeam] ?? 0) + 1
  }
  const topClub = Object.entries(clubCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '-'

  // 平均評点
  const allRatings = matches.flatMap(m => m.ratings ?? [])
  const avgRating = allRatings.length
    ? allRatings.reduce((s, r) => s + r.score, 0) / allRatings.length
    : 0

  return { total, leagueCounts, monthCounts, topClub, avgRating }
}
