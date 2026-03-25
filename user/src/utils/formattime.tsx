export function formatTo12Hour(timeStr: string) {
  const [hourStr, minuteStr] = timeStr.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  const formattedMinute = minute < 10 ? "0" + minute : minute;
  return `${formattedHour}:${formattedMinute} ${ampm}`;
}
