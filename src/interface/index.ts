export type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  status: EventStatus;
};

export interface EventsState {
  events: Event[];
}

export type EventStatus = "Upcoming" | "Completed";