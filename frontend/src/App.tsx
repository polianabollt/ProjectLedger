import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Types from "./pages/Types";
import MainLayout from "./layout/MainLayout";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="/clients"
          element={
            <MainLayout>
              <Clients />
            </MainLayout>
          }
        />
        <Route
          path="/clients/:id"
          element={
            <MainLayout>
              <ClientDetail  />
            </MainLayout>
          }
        />
        <Route
          path="/courses"
          element={
            <MainLayout>
              <Courses />
            </MainLayout>
          }
        />
        <Route
          path="/courses/:id"
          element={
            <MainLayout>
              <CourseDetail />
            </MainLayout>
          }
        />
        <Route
          path="/types"
          element={
            <MainLayout>
              <Types />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
