import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home';
import InterviewsDetail from './pages/InterviewsDetail';
import InterviewCreate from './pages/InterviewCreate';
import InterviewEdit from './pages/InterviewEdit';


function App() {
  return (
    <Router>
      <Routes>

        <Route exact path="/" element={<Home/>} />
        <Route path="/interviews" element={<InterviewsDetail/>}/>
        <Route path="/interviews/create" element={<InterviewCreate/>} />
        <Route path="/interviews/edit/:id" element={<InterviewEdit/>} />
        </Routes>
    </Router>
  );
}

export default App;
