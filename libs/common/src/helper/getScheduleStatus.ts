import { DaysEnum, EnableDisableStatusEnum } from '../constants/days.enum';

export function getScheduleStatus(daysEnabled: string[]): string {
  const daysMap: string[] = [
    DaysEnum.SUN,
    DaysEnum.MON,
    DaysEnum.TUE,
    DaysEnum.WED,
    DaysEnum.THU,
    DaysEnum.FRI,
    DaysEnum.SAT,
  ];

  const schedule: string[] = Array(7).fill(EnableDisableStatusEnum.DISABLED);

  daysEnabled.forEach((day) => {
    const index: number = daysMap.indexOf(day);
    if (index !== -1) {
      schedule[index] = EnableDisableStatusEnum.ENABLED;
    }
  });

  return schedule.join('');
}
export function getEnabledDays(schedule: string): string[] {
  const daysMap: string[] = [
    DaysEnum.SUN,
    DaysEnum.MON,
    DaysEnum.TUE,
    DaysEnum.WED,
    DaysEnum.THU,
    DaysEnum.FRI,
    DaysEnum.SAT,
  ];
  const enabledDays: string[] = [];

  // Iterate through the schedule string
  for (let i = 0; i < schedule.length; i++) {
    if (schedule[i] === EnableDisableStatusEnum.ENABLED) {
      enabledDays.push(daysMap[i]);
    }
  }

  return enabledDays;
}
