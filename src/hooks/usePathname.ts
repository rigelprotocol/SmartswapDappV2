import { useLocation } from 'react-router-dom';

export const usePathname = () => {
  const location = useLocation();
  return location.pathname;
}
