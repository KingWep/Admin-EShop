import { BrowserRouter } from 'react-router-dom';
import { UIProvider } from './store/uiStore';
import AppRoutes from './routes/AppRoutes';

const App = () => (
  <BrowserRouter>
    <UIProvider>
      <AppRoutes />
    </UIProvider>
  </BrowserRouter>
);

export default App;
