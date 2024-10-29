export class Today {
  static timeStampStringToSeconds(timeStr: string | undefined): number {
    if (!timeStr) {
      return 0;
    }
    const parts = timeStr.split(/\s+/);
    const timestampString = parts.length < 2 ? parts[0] : parts[1];
    const timeParts = timestampString.split(':');
    return parseInt(timeParts[0]) * 3600 + parseInt(timeParts[1]) * 60 + parseInt(timeParts[2]);
  }

  static parseSeconds(seconds: number): {seconds: number, dateTimeString: string, timeStampString: string} {
    const now = new Date();
    const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, seconds));

    // Format the date string in 'YYYY-MM-DD HH:MM:SS' format in UTC
    const dateString = todayUTC.toISOString().replace('T', ' ').slice(0, 19);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return {
      seconds: seconds,
      dateTimeString: dateString,
      timeStampString: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
    };
  }

  /**
   * Parse time string in 'HH:MM:SS' format and return an object with
   * today's date and the given time in seconds and string formats.
   * @returns - Object containing seconds and string values. {time: seconds ignoring date, dateTimeString: 'YYYY-MM-DD HH:MM:SS', timeStampString: 'HH:MM:SS'}
   * @param timeString The string representation in csv can be '03:06:05' or '3:6:5'
   */
  static parseTime(timeString: string): {seconds: number, dateTimeString: string, timeStampString: string} {
    const defaultValue = {dateTimeString: Today.getBeginningOfDayString(), timeStampString: '00:00:00', seconds: 0};

    if (!timeString) {
      return defaultValue;
    }

    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      return defaultValue;
    }

    // Create a new Date object in UTC for the provided time
    const now = new Date();
    const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hours, minutes, seconds));

    // Calculate total seconds from the beginning of the day in UTC
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    // Format the date string in 'YYYY-MM-DD HH:MM:SS' format in UTC
    const dateString = todayUTC.toISOString().replace('T', ' ').slice(0, 19);

    return {
      seconds: totalSeconds,
      dateTimeString: dateString,
      timeStampString: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    };
  }

  static getBeginningOfDayString() {
    const now = new Date();

    // Create a new date with time set to 00:00:00 UTC
    const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));

    // Manually format the date to 'YYYY-MM-DD HH:MM:SS' in UTC
    const year = startOfDay.getUTCFullYear();
    const month = String(startOfDay.getUTCMonth() + 1).padStart(2, '0');
    const day = String(startOfDay.getUTCDate()).padStart(2, '0');
    const hours = String(startOfDay.getUTCHours()).padStart(2, '0');
    const minutes = String(startOfDay.getUTCMinutes()).padStart(2, '0');
    const seconds = String(startOfDay.getUTCSeconds()).padStart(2, '0');

    // Return the formatted string
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  static parseEpochTime(epochTime: number): {seconds: number, dateTimeString: string, timeStampString: string} {
    // Create a date object from the epoch time
    const inputDate = new Date(epochTime * 1000); // Convert epoch to milliseconds

    // Get hours, minutes, and seconds from the input date
    const hours = inputDate.getUTCHours();
    const minutes = inputDate.getUTCMinutes();
    const seconds = inputDate.getUTCSeconds();
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    // Create today's date
    const now = new Date();
    const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hours, minutes, seconds));
    // Format the date string in 'YYYY-MM-DD HH:MM:SS' format in UTC
    const dateTimeString = todayUTC.toISOString().replace('T', ' ').slice(0, 19);

    return {
      seconds: totalSeconds,
      dateTimeString,
      timeStampString: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  };
    }
}
