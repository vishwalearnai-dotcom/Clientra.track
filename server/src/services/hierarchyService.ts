import { OrganizationMember } from '../types/index.js';
import { dataStore } from '../db/store.js';

export class HierarchyService {
  /**
   * Recursively finds all direct and indirect reports for a given member.
   * Solves unpredictable company hierarchies: Founder -> VP -> Manager -> Lead -> Member
   */
  public static getSubordinateMemberIds(managerMemberId: string, orgId: string): string[] {
    const orgMembers = dataStore.members.filter(m => m.org_id === orgId && m.is_active);
    const subordinateIds = new Set<string>();

    const queue: string[] = [managerMemberId];

    while (queue.length > 0) {
      const currentManagerId = queue.shift()!;
      const directReports = orgMembers.filter(m => m.reports_to_member_id === currentManagerId);

      for (const report of directReports) {
        if (!subordinateIds.has(report.id)) {
          subordinateIds.add(report.id);
          queue.push(report.id); // Continue recursively down the reporting tree
        }
      }
    }

    return Array.from(subordinateIds);
  }

  /**
   * Evaluates if a viewer can access a specific employee's profile and tasks.
   */
  public static canViewMember(viewer: OrganizationMember, targetMemberId: string): boolean {
    if (viewer.id === targetMemberId) return true;
    if (viewer.permission_level === 'ADMIN') return true;

    if (viewer.permission_level === 'MANAGER') {
      const subordinates = this.getSubordinateMemberIds(viewer.id, viewer.org_id);
      return subordinates.includes(targetMemberId);
    }

    return false; // Individual contributors only view themselves
  }
}
