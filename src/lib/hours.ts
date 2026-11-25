import { HOURS, DAY_NAMES } from '../data/site';

export function fmtTime(m: number): string {
  const h = Math.floor(m / 60), mm = m % 60;
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${mm < 10 ? '0' : ''}${mm} ${h >= 12 ? 'PM' : 'AM'}`;
}

export interface OpenStatus { open: boolean; text: string }

/** day = JS getDay(), mins = minutes since midnight, both in America/Chicago. */
export function openStatus(day: number, mins: number): OpenStatus {
  const r = HOURS[day];
  if (r && mins >= r[0] && mins < r[1]) return { open: true, text: `Open now · closes ${fmtTime(r[1])}` };
  if (r && mins < r[0]) return { open: false, text: `Closed now · opens today at ${fmtTime(r[0])}` };
  let add = 1;
  while (!HOURS[(day + add) % 7]) add++;
  const nd = (day + add) % 7;
  const when = add === 1 ? 'tomorrow' : DAY_NAMES[nd];
  return { open: false, text: `Closed now · opens ${when} at ${fmtTime(HOURS[nd]![0])}` };
}
