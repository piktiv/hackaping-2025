import React from 'react';
import Layout from '../components/layout/Layout';
import EmployeeForm from '../components/employees/EmployeeForm';

const EmployeeFormPage: React.FC = () => {
  return (
    <Layout>
      <EmployeeForm />
    </Layout>
  );
};

export default EmployeeFormPage;