import { BrowserRouter ,Route } from 'react-router-dom';

import { NewRoom } from './pages/NewRoom';
import { Home } from './pages/Home';

import { AuthContextProvider } from './contexts/AuthContext';


function App() {

  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Route path="/rooms/new" component={NewRoom} />
        <Route path="/" exact={true} component={Home} />
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
