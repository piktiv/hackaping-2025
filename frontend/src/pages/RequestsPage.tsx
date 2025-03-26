import React from 'react';
import Layout from '../components/layout/Layout';
import ScheduleChangeForm from '../components/requests/ScheduleChangeForm';

const RequestsPage: React.FC = () => {
  return (
    <Layout>
      <ScheduleChangeForm />
    </Layout>
  );
};

export default RequestsPage;