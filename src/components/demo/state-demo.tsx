'use client';

import React from 'react';
import { useConfig } from '@/hooks/global/use-config';
import { useUser } from '@/hooks/global/use-user';

export const StateDemo: React.FC = () => {
  const { config, updateConfig } = useConfig();
  const { user, updateUser } = useUser();

  const toggleNav = () => {
    updateConfig({ isNavOpen: !config.isNavOpen });
  };

  const updateUserName = () => {
    updateUser({ name: `User ${Date.now()}` });
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-bold mb-2">Config State Demo</h3>
        <p>Nav is: {config.isNavOpen ? 'Open' : 'Closed'}</p>
        <button
          onClick={toggleNav}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Toggle Nav
        </button>
      </div>

      <div>
        <h3 className="font-bold mb-2">User State Demo</h3>
        <p>Current user: {user.name || 'Not set'}</p>
        <button
          onClick={updateUserName}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Update Name
        </button>
      </div>

      <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded overflow-auto">
        {JSON.stringify({ config, user }, null, 2)}
      </pre>
    </div>
  );
};
