export const TIME_PRESETS = {
  full: { startTime: "00:00", endTime: "23:59" },
  specific: { startTime: "08:00", endTime: "17:00" },
};

export type TimePreset = keyof typeof TIME_PRESETS;
export type EventTime = (typeof TIME_PRESETS)[TimePreset];
