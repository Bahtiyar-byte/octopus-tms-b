import React, { useState } from 'react';

interface AnnouncementFormProps {
  onSubmit: (data: {
    title: string;
    message: string;
    priority: string;
    recipients: string[];
  }) => void;
}

export const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('normal');
  const [recipients, setRecipients] = useState<string[]>([]);

  const handleSubmit = () => {
    if (!title.trim() || !message.trim()) {
      alert('⚠️ Please fill in all required fields:\n• Announcement Title\n• Message Content');
      return;
    }

    onSubmit({
      title,
      message,
      priority,
      recipients
    });

    // Reset form
    setTitle('');
    setMessage('');
    setPriority('normal');
    setRecipients([]);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Announcement Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter announcement title..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message *
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your announcement message..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Priority Level
        </label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="low">Low Priority</option>
          <option value="normal">Normal Priority</option>
          <option value="high">High Priority</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recipients
        </label>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="all-team"
              checked={recipients.length === 0}
              onChange={(e) => {
                if (e.target.checked) {
                  setRecipients([]);
                }
              }}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="all-team" className="ml-2 text-sm text-gray-700">
              All Team Members (Default)
            </label>
          </div>
          {['Dispatchers', 'Drivers', 'Customer Service', 'Operations'].map((group) => (
            <div key={group} className="flex items-center">
              <input
                type="checkbox"
                id={group.toLowerCase()}
                checked={recipients.includes(group)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setRecipients([...recipients, group]);
                  } else {
                    setRecipients(recipients.filter(r => r !== group));
                  }
                }}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={group.toLowerCase()} className="ml-2 text-sm text-gray-700">
                {group} Only
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};