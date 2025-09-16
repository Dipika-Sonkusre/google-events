export type Event = {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  status: EventStatus;
};

export interface EventsState {
  events: Event[];
}

export type EventStatus = "Upcoming" | "Completed";