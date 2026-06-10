import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import Home from "./Home";
import CreateBook from "./CreateBook";
import DeleteBook from "./DeleteBook";
import UserManagement from "./UserManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<Home />} />
        <Route path="/create" element={<CreateBook />} />
        <Route path="/delete" element={<DeleteBook />} />
        <Route path="/users" element={<UserManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;