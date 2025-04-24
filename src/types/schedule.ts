export type ScheduleItem = {
  subject: string;
  time: string;
  desc: string;
  color: string;
};

export type ScheduleMap = Record<string, ScheduleItem[]>;
