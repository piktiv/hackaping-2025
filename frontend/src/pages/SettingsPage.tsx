import React from 'react';
import Layout from '../components/layout/Layout';
import SettingsForm from '../components/settings/SettingsForm';

const SettingsPage: React.FC = () => {
  return (
    <Layout>
      <SettingsForm />
    </Layout>
  );
};

export default SettingsPage;