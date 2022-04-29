import './App.css';
import Navbar from './Navbar';
import AppRoutes from './Routes';

function App() {
  return (
      <div className="App">
          <Navbar />
          <div className="App-main container-fluid">
            <AppRoutes />
          </div>
      </div>
  );
}

export default App;
