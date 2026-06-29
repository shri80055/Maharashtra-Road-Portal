import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Home from "../pages/Home";
import RegisterRoad from "../pages/RegisterRoad";
import Praroop1 from "../pages/Praroop1";
import Praroop2 from "../pages/Praroop2";
import DraftRecords from "../pages/DraftRecords";
import SubmittedRecords from "../pages/SubmittedRecords";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/dashboard"
        element={<Home />}
      />

      <Route
        path="/register-road"
        element={<RegisterRoad />}
      />

      <Route 
         path="/praroop1"
         element={<Praroop1 />}
      />

      <Route
      path="/praroop2"
      element={<Praroop2 />}
      />

      <Route 
      path="/drafts"
      element={<DraftRecords />}
      />

      <Route
      path="/submitted"
      element={<SubmittedRecords />}
      />

    </Routes>
  );
}