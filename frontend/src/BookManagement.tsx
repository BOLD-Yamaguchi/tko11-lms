import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import CreateBook from "./CreateBook";
import DeleteBook from "./DeleteBook";

function BookManagement() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreateBook />} />
      <Route path="/delete" element={<DeleteBook />} />
    </Routes>
  );
}

export default BookManagement;
