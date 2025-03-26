import React from 'react';
import Layout from '../components/layout/Layout';
import ScheduleView from '../components/schedule/ScheduleView';

const SchedulePage: React.FC = () => {
  return (
    <Layout>
      <ScheduleView />
    </Layout>
  );
};

export default SchedulePage;