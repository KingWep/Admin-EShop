import { BrowserRouter } from 'react-router-dom';
import { UIProvider } from './store/uiStore';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <UIProvider>
        <AppRoutes />
      </UIProvider>
    </BrowserRouter>
  );
}