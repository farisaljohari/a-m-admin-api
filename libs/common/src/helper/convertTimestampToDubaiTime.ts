import { EnableDisableStatusEnum } from '../constants/days.enum';

export function convertTimestampToDubaiTime(timestamp) {
  // Convert timestamp to milliseconds
  const date = new Date(timestamp * 1000);

  // Convert to Dubai time (UTC+3)
  const dubaiTimeOffset = 3 * 60; // 3 hours in minutes
  const dubaiTime = new Date(date.getTime() + dubaiTimeOffset * 60 * 1000);

  // Format the date as YYYYMMDD
  const year = dubaiTime.getUTCFullYear();
  const month = String(dubaiTime.getUTCMonth() + 1).padStart(
    2,
    EnableDisableStatusEnum.DISABLED,
  ); // Months are zero-based
  const day = String(dubaiTime.getUTCDate()).padStart(
    2,
    EnableDisableStatusEnum.DISABLED,
  );

  // Format the time as HH:MM (24-hour format)
  const hours = String(dubaiTime.getUTCHours()).padStart(
    2,
    EnableDisableStatusEnum.DISABLED,
  );
  const minutes = String(dubaiTime.getUTCMinutes()).padStart(
    2,
    EnableDisableStatusEnum.DISABLED,
  );

  // Return formatted date and time
  return {
    date: `${year}${month}${day}`,
    time: `${hours}:${minutes}`,
  };
}
