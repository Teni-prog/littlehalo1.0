// Helper functions for availability data format conversion

/**
 * Convert time range (from/to) to hourly flags
 * Example: "09:00" to "17:00" becomes { "09": true, "10": true, ..., "16": true }
 */
export function timeRangeToHourFlags(fromTime, toTime) {
  if (!fromTime || !toTime) return {};
  
  const [fromH] = fromTime.split(":").map(Number);
  const [toH] = toTime.split(":").map(Number);
  
  const flags = {};
  for (let h = fromH; h < toH; h++) {
    flags[h.toString().padStart(2, "0")] = true;
  }
  return flags;
}

/**
 * Convert hourly flags to time range
 * Example: { "09": true, "10": true, ..., "16": true } becomes { from: "09:00", to: "17:00" }
 */
export function hourFlagsToTimeRange(flags) {
  if (!flags || Object.keys(flags).length === 0) {
    return { from: "09:00", to: "17:00" };
  }

  const hours = Object.keys(flags)
    .filter(h => flags[h])
    .map(h => parseInt(h))
    .sort((a, b) => a - b);

  if (hours.length === 0) {
    return { from: "09:00", to: "17:00" };
  }

  const from = hours[0];
  const to = hours[hours.length - 1] + 1;

  return {
    from: `${from.toString().padStart(2, "0")}:00`,
    to: `${to.toString().padStart(2, "0")}:00`
  };
}

/**
 * Convert full availability object from day-based format to hourly format
 * Old: { monday: { available: true, from: "09:00", to: "17:00" } }
 * New: { monday: { "09": true, "10": true, ... } }
 */
export function convertToHourlyFormat(dayBasedAvailability) {
  const hourly = {};
  
  Object.entries(dayBasedAvailability).forEach(([day, data]) => {
    if (data?.available && data?.from && data?.to) {
      hourly[day] = timeRangeToHourFlags(data.from, data.to);
    } else {
      hourly[day] = {};
    }
  });

  return hourly;
}

/**
 * Convert from hourly format back to day-based format
 * New: { monday: { "09": true, "10": true, ... } }
 * Old: { monday: { available: true, from: "09:00", to: "17:00" } }
 */
export function convertFromHourlyFormat(hourlyAvailability) {
  const dayBased = {};

  Object.entries(hourlyAvailability).forEach(([day, flags]) => {
    const timeRange = hourFlagsToTimeRange(flags);
    const hasAvailability = Object.keys(flags).some(h => flags[h]);
    
    dayBased[day] = {
      available: hasAvailability,
      from: timeRange.from,
      to: timeRange.to
    };
  });

  return dayBased;
}

/**
 * Get availability for a specific hour on a specific day
 * hour format: "09", "10", etc.
 */
export function isHourAvailable(availability, day, hour) {
  return availability?.[day]?.[hour] === true;
}

/**
 * Toggle availability for a specific hour on a specific day
 */
export function toggleHourAvailability(availability, day, hour) {
  const current = availability?.[day]?.[hour];
  return {
    ...availability,
    [day]: {
      ...(availability[day] || {}),
      [hour]: !current
    }
  };
}

/**
 * Set availability for a range of hours on a specific day
 */
export function setHourRangeAvailability(availability, day, fromHour, toHour, available) {
  const newAvail = { ...(availability[day] || {}) };
  
  for (let h = fromHour; h <= toHour; h++) {
    const hour = h.toString().padStart(2, "0");
    newAvail[hour] = available;
  }

  return {
    ...availability,
    [day]: newAvail
  };
}
