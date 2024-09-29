import React,{useState} from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { Navbar} from './components';
import { Header, Footer } from './containers';
import AuthenticatedRoutes from './AuthenticatedRoutes';
import './App.css';

const App = () => {

  const [authenticated, setAuthenticated] = useState(false);

  return (
    <Router>
      <div className='App'>
      <div className="gradient__bg">
        <Navbar 
          setAuthenticated={setAuthenticated} 
          authenticated={authenticated} 
        />
        <Header 
          setAuthenticated={setAuthenticated} 
          authenticated={authenticated} 
        />
        <AuthenticatedRoutes 
        setAuthenticated={setAuthenticated} 
        authenticated={authenticated} />
        </div>
        <Footer 
          setAuthenticated={setAuthenticated} 
          authenticated={authenticated}
        />
      </div>
    </Router>
  );
}

export default App;