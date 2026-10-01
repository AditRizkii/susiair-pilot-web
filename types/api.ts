export type LoginResponse = { token: string }

export type Pilot = {
  name: string
  totalFlightHours: number
  avatarUrl: string
  limits: { daily: number; weekly: number; monthly: number; annual: number }
  today: string
}
export type FlightPoint = { date: string; hours: number }
export type FlightSummary = {
  range: '1w' | '1m' | '3m' | '6m' | '1y'
  limit: number
  max: number
  windowDays: number
  displayRangeDays: number
  today: string
  points: FlightPoint[]
}
export type PilotDocument = { id: string; label: string; expiryDate: string; daysRemaining: number; status: 'safe' | 'soon' | 'expired' }
export type DutyLegend = { code: string; label: string; color: string }
export type ScheduleEntry = { id: string; duty_date: string; status: 1 | 2; base_name: string; base_color: string; duty_type: string; count_schedules: number; count_logbooks: number }
export type ScheduleResponse = { year: number; month: number; today: string; legend: DutyLegend[]; schedules: ScheduleEntry[] }
