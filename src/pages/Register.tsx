
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/hooks/use-auth';
import { Navigate } from 'react-router-dom';

const Register = () => {
  const { user, loading } = useAuth();

  // If user is already logged in, redirect to dashboard
  if (user && !loading) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <RegisterForm />
    </div>
  );
};

export default Register;
