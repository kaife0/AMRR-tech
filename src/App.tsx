import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ItemProvider } from './context/ItemContext';
import Navigation from './components/Navigation';
import ViewItems from './pages/ViewItems';
import AddItem from './pages/AddItem';
import './App.css';

function App() {
  return (
    <ItemProvider>
      <Router>
        <div className="app">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/view-items" replace />} />
              <Route path="/view-items" element={<ViewItems />} />
              <Route path="/add-item" element={<AddItem />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ItemProvider>
  );
}

export default App;
