import './App.css';
import Home from './components/Home.js';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import ListCreate from "./components/ListCreate";
import ListDetailPage from "./components/ListDetailPage";




function App() {
  return (
      <div className="App">

          <BrowserRouter>

              <Routes>
                  <Route path="/" element={<Home/>}/>
                  <Route path="/listCreate" element={<ListCreate/>}/>
                  <Route path="/shoppingList/:id" element={<ListDetailPage/>}/>
              </Routes>
          </BrowserRouter>

      </div>
  );
}



export default App;
