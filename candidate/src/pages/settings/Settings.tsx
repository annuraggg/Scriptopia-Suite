import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Switch, 
  Avatar, 
  Button, 
  Select, 
  SelectItem,
  Spinner 
} from "@heroui/react";
import { motion } from "framer-motion";
import { 
  Lock, 
  Bell, 
  UserCircle, 
  Globe, 
  ShieldCheck 
} from "lucide-react";

interface SettingsContextType {
  profile: {
    name: string;
    email: string;
  };
  profileVisibility: string;
  notifications: {
    jobUpdates: boolean;
    newsletters: boolean;
    marketingEmails: boolean;
  };
  updateSettings: (newSettings: Partial<SettingsContextType>) => void;
  isSaving: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  profile: {
    name: 'Jane Doe',
    email: 'jane.doe@example.com'
  },
  profileVisibility: 'recruiter_match',
  notifications: {
    jobUpdates: true,
    newsletters: false,
    marketingEmails: false
  },
  updateSettings: () => {},
  isSaving: false
});

const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsContextType>({
    profile: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com'
    },
    profileVisibility: 'recruiter_match',
    notifications: {
      jobUpdates: true,
      newsletters: false,
      marketingEmails: false
    },
    updateSettings: (newSettings) => {
      setSettings(prev => ({
        ...prev,
        ...newSettings,
        isSaving: true
      }));

      setTimeout(() => {
        setSettings(prev => ({
          ...prev,
          ...newSettings,
          isSaving: false
        }));
      }, 1000);
    },
    isSaving: false
  });

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};

const SettingsPage: React.FC = () => {
  const { 
    profile, 
    profileVisibility, 
    notifications, 
    updateSettings,
    isSaving 
  } = useContext(SettingsContext);

  const visibilityOptions = [
    { value: 'recruiter_match', label: 'Matched Recruiters Only' },
    { value: 'all_recruiters', label: 'All Recruiters' },
    { value: 'private', label: 'Private' }
  ];

  const navigate = useNavigate();

  const handleSaveSettings = () => {
    updateSettings({
      profileVisibility,
      notifications
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pb-6"
    >
      <div className="sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-start justify-start">
          <motion.h1 
            className="text-3xl font-bold"
          >
            Account Settings
          </motion.h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-2 space-y-3 mt-2">
        <Card className="mb-2">
          <CardHeader className="flex gap-4 items-center">
            <Avatar 
              src="/placeholder-avatar.jpg" 
              className="w-20 h-20" 
            />
            <div>
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <p className="text-gray-500">{profile.email}</p>
            </div>
            <Button 
              color="primary" 
              variant="light" 
              className="ml-auto"
              startContent={<UserCircle />}
              onClick={() => navigate('/profile')}
            >
              Edit Profile
            </Button>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex items-center">
            <Lock className="mr-3" />
            <h3 className="text-lg font-semibold">Privacy Settings</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <Select
                label="Profile Visibility"
                selectedKeys={[profileVisibility]}
                onChange={(e) => updateSettings({ 
                  profileVisibility: e.target.value 
                })}
                startContent={<Globe />}
              >
                {visibilityOptions.map((option) => (
                  <SelectItem key={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <ShieldCheck className="mr-3" />
                  <span>Show profile to matched recruiters</span>
                </div>
                <Switch 
                  isSelected={profileVisibility === 'recruiter_match'}
                  onValueChange={(isSelected) => 
                    updateSettings({ 
                      profileVisibility: isSelected ? 'recruiter_match' : 'private' 
                    })
                  }
                />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex items-center">
            <Bell className="mr-3" />
            <h3 className="text-lg font-semibold">Notification Preferences</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {[
                { 
                  key: 'jobUpdates', 
                  label: 'Job Updates', 
                  description: 'Receive notifications about matching job opportunities' 
                },
                { 
                  key: 'newsletters', 
                  label: 'Career Newsletters', 
                  description: 'Receive monthly career development newsletters' 
                },
                { 
                  key: 'marketingEmails', 
                  label: 'Marketing Communications', 
                  description: 'Opt-in for promotional emails and offers' 
                }
              ].map((notification) => (
                <div 
                  key={notification.key} 
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{notification.label}</p>
                    <p className="text-gray-500 text-sm">{notification.description}</p>
                  </div>
                  <Switch
                    isSelected={notifications[notification.key as keyof typeof notifications]}
                    onValueChange={(isSelected) => 
                      updateSettings({
                        notifications: {
                          ...notifications,
                          [notification.key]: isSelected
                        }
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button variant="bordered" color="default">
            Cancel
          </Button>
          <Button 
            color="primary" 
            onClick={handleSaveSettings}
            isDisabled={isSaving}
          >
            {isSaving ? <Spinner size="sm" /> : 'Save Changes'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const Settings: React.FC = () => {
  return (
    <SettingsProvider>
      <SettingsPage />
    </SettingsProvider>
  );
};

export default Settings;