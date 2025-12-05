import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Playground() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/api-explorer');
  }, [navigate]);
  
  return null;
}
