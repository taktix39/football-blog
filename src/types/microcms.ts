// src/types/microcms.ts
// microCMS レスポンス型定義

export type League =
  | 'epl'
  | 'laliga'
  | 'cl'
  | 'bundesliga'
  | 'seriea'
  | 'ligue1'
  | 'eredivisie'
  | 'other'

export const LEAGUE_LABELS: Record<League, string> = {
  epl: 'Premier League',
  laliga: 'La Liga',
  cl: 'Champions League',
  bundesliga: 'Bundesliga',
  seriea: 'Serie A',
  ligue1: 'Ligue 1',
  eredivisie: 'Eredivisie',
  other: 'その他',
}

export const LEAGUE_CLASS: Record<League, string> = {
  epl: 'badge-epl',
  laliga: 'badge-laliga',
  cl: 'badge-cl',
  bundesliga: 'badge-bundesliga',
  seriea: 'badge-seriea',
  ligue1: 'badge-ligue1',
  eredivisie: 'badge-eredivisie',
  other: 'badge-other',
}

export type MicroCMSImage = {
  url: string
  height: number
  width: number
}

export type PlayerRating = {
  fieldId: 'ratings'
  player: string
  score: number
  isMom?: boolean
  comment?: string
}

export type Match = {
  id: string
  createdAt: string
  updatedAt: string
  publishedAt: string

  title: string
  league: { id: League }[]   // microCMSのセレクトは配列で返る
  round?: string
  matchDate: string          // ISO8601
  homeTeam: string
  homeAbbr: string
  awayTeam: string
  awayAbbr: string
  scoreHome: number
  scoreAway: number
  venue?: string
  thumbnail?: MicroCMSImage

  logBefore?: string         // リッチテキスト（HTML文字列）
  logDuring?: string
  logAfter?: string

  ratings?: PlayerRating[]
  tags?: { id: string; name: string }[]
}

export type MicroCMSListResponse<T> = {
  contents: T[]
  totalCount: number
  offset: number
  limit: number
}

// ヘルパー: leagueフィールドの値を取り出す
export function getLeague(match: Match): League {
  return match.league?.[0]?.id ?? 'other'
}

// ヘルパー: 表示用の日付文字列
export function formatMatchDate(isoDate: string): string {
  const d = new Date(isoDate)
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
}
