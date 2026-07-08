/**
 * Calendar Event Utilities
 * For generating Google Calendar links and .ics file downloads
 */

const MONTH_MAP: Record<string, number> = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

function getEventDate(monthStr: string, dayStr: string): { start: Date; end: Date } {
  const normalizedMonth = monthStr.trim().toLowerCase().slice(0, 3);
  const monthIndex = MONTH_MAP[normalizedMonth] !== undefined ? MONTH_MAP[normalizedMonth] : 0;
  const day = parseInt(dayStr.trim(), 10) || 1;
  
  const currentDate = new Date();
  let year = currentDate.getFullYear(); // Default to current year (2026 in this sandbox)
  
  // If the event month is earlier in the year than the current month, it's likely for next year
  if (monthIndex < currentDate.getMonth()) {
    year += 1;
  }
  
  // Create event start date (e.g. 18:00/6:00 PM local time on that day)
  const start = new Date(year, monthIndex, day, 18, 0, 0);
  // Create event end date (e.g. 22:00/10:00 PM local time on that day)
  const end = new Date(year, monthIndex, day, 22, 0, 0);
  
  return { start, end };
}

function formatDateToIcsString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return [
    date.getUTCFullYear(),
    pad(date.getUTCMonth() + 1),
    pad(date.getUTCDate()),
    'T',
    pad(date.getUTCHours()),
    pad(date.getUTCMinutes()),
    pad(date.getUTCSeconds()),
    'Z'
  ].join('');
}

export function generateGoogleCalendarUrl(event: {
  title: string;
  description: string;
  location: string;
  month: string;
  day: string;
}): string {
  const { start, end } = getEventDate(event.month, event.day);
  const startStr = formatDateToIcsString(start);
  const endStr = formatDateToIcsString(end);
  
  const baseUrl = 'https://calendar.google.com/calendar/render';
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startStr}/${endStr}`,
    details: event.description,
    location: event.location,
  });
  
  return `${baseUrl}?${params.toString()}`;
}

export function downloadIcsFile(event: {
  title: string;
  description: string;
  location: string;
  month: string;
  day: string;
}): void {
  const { start, end } = getEventDate(event.month, event.day);
  const startStr = formatDateToIcsString(start);
  const endStr = formatDateToIcsString(end);
  const timestampStr = formatDateToIcsString(new Date());
  
  const uid = `lsk-event-${Date.now()}@lskevents.co.zm`;
  
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//LSK Events Network//NONSGML Calendar Event v1.0//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${timestampStr}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:${event.title.replace(/[,;]/g, '\\$&')}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n').replace(/[,;]/g, '\\$&')}`,
    `LOCATION:${event.location.replace(/[,;]/g, '\\$&')}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR'
  ];
  
  const icsContent = icsLines.join('\r\n');
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  // Use a clean filename
  const cleanTitle = event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
  link.setAttribute('download', `${cleanTitle}-event.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
