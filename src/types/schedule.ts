export type ScheduleItem = {
  subject: string;
  time: string;
  desc: string;
};

export type ScheduleMap = Record<string, ScheduleItem[]>;
