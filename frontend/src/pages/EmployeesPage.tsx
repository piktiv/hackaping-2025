import React from 'react';
import Layout from '../components/layout/Layout';
import EmployeeList from '../components/employees/EmployeeList';

const EmployeesPage: React.FC = () => {
  return (
    <Layout>
      <EmployeeList />
    </Layout>
  );
};

export default EmployeesPage;