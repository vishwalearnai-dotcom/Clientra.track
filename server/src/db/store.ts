import { Organization, Department, OrganizationMember, Task, NotificationLog } from '../types/index.js';

// Fresh, empty multi-tenant datastore with zero hardcoded company or user records.
// Populated in real-time as users sign up, get approved, and onboard their teams.
class DataStore {
  public organizations: Organization[] = [];
  public departments: Department[] = [];
  public members: OrganizationMember[] = [];
  public tasks: Task[] = [];
  public notificationLogs: NotificationLog[] = [];
}

export const dataStore = new DataStore();
