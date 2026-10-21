import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Home, AlertCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-[#EDE3F7] text-[#8B5FBF] flex items-center justify-center mb-4 shadow-soft">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-black text-[#503477] mb-2">404 — Page Not Found</h1>
      <p className="text-xs sm:text-sm text-[#766C82] max-w-xs mb-6 leading-relaxed">
        The maternal care page you are looking for does not exist or has been relocated.
      </p>
      <Button
        variant="primary"
        onClick={() => navigate('/home')}
        icon={<Home className="w-4 h-4" />}
      >
        Return to Home Dashboard
      </Button>
    </div>
  );
};
