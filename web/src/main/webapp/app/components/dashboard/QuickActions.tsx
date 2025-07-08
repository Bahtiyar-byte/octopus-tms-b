import React from 'react';

interface QuickActionsProps {
  onAnnouncementClick: () => void;
  onCustomerOutreachClick: () => void;
  onReportsClick: () => void;
  onTeamSettingsClick: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onAnnouncementClick,
  onCustomerOutreachClick,
  onReportsClick,
  onTeamSettingsClick
}) => {
  const actions = [
    {
      icon: 'fas fa-bullhorn',
      label: 'Team Announcement',
      onClick: onAnnouncementClick
    },
    {
      icon: 'fas fa-headset',
      label: 'Customer Outreach',
      onClick: onCustomerOutreachClick
    },
    {
      icon: 'fas fa-file-alt',
      label: 'Generate Reports',
      onClick: onReportsClick
    },
    {
      icon: 'fas fa-cogs',
      label: 'Team Settings',
      onClick: onTeamSettingsClick
    }
  ];

  return (
    <section className="mb-6">
      <h2 className="flex items-center text-xl font-semibold mb-4">
        <i className="fas fa-bolt mr-2 text-blue-600"></i>
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-blue-50 hover:border-blue-200 transition-colors text-center"
          >
            <i className={`${action.icon} text-blue-500 text-2xl mb-2`}></i>
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
};