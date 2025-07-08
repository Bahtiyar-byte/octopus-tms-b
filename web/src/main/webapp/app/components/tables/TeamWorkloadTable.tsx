import React from 'react';
import  Card  from '../ui/Card';
import { TeamWorkload } from '../../data/teamWorkLoad';

interface TeamWorkloadTableProps {
  teamWorkload: TeamWorkload[];
}

export const TeamWorkloadTable: React.FC<TeamWorkloadTableProps> = ({ teamWorkload }) => {
  const getUtilizationColor = (utilization: number) => {
    if (utilization > 85) return 'bg-green-500';
    if (utilization > 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <section className="mb-6">
      <h2 className="flex items-center text-xl font-semibold mb-4">
        <i className="fas fa-users-cog mr-2 text-blue-600"></i>
        Team Workload & Utilization
      </h2>
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Member</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Loads</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Tasks</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teamWorkload.map((member, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-3">
                        {member.member.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="text-sm font-medium text-gray-900">{member.member}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{member.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{member.activeLoads}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{member.pendingTasks}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{member.lastActive}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`${getUtilizationColor(member.utilization)} h-2.5 rounded-full`}
                        style={{ width: `${member.utilization}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1 text-right">{member.utilization}%</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
};