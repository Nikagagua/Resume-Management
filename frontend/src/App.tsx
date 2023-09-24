import React, { useContext, lazy, Suspense} from "react";
import { ThemeContext } from "./context/theme.context";
import Navbar from "./components/navbar/navbar.component";
import {Routes, Route} from "react-router-dom"
import CustomLinearProgress from "./custom-linear-progress/customlinearprogress.components";


//Import with lazy loading
const Home = lazy(() => import ("./pages/home/home.page"));

const Companies = lazy(() => import ("./pages/companies/companies.page"));
const AddCompany = lazy(() => import ("./pages/companies/addcompany.page"));
const EditCompany = lazy(() => import ("./pages/companies/editcompany.page"));

const Jobs = lazy(() => import ("./pages/jobs/jobs.page"));
const AddJob = lazy(() => import ("./pages/jobs/addjob.page"));
const EditJob = lazy(() => import ("./pages/jobs/editjob.page"));

const Candidates = lazy(() => import ("./pages/candidates/candidates.page"));
const AddCandidate = lazy(() => import ("./pages/candidates/addcandidate.page"));
const EditCandidate = lazy(() => import ("./pages/candidates/editcandidate.page"));
const App = () => {
    const {darkMode} = useContext(ThemeContext);
   
    const appStyles = darkMode ? "app dark" : "app";
    
  return (
      <div className={appStyles}>
          <Navbar />
          <div className="wrapper">
              <Suspense fallback={<CustomLinearProgress />}>
                  <Routes>
                      <Route path='/' element={<Home />}>
                      </Route>
                      
                      <Route path='/companies'>
                          <Route index element={<Companies />} />
                          <Route path="add" element={ <AddCompany/> } />
                          <Route path="edit/:id" element={ <EditCompany/> } />
                      </Route>

                      <Route path='/jobs'>
                          <Route index element={<Jobs />} />
                          <Route path="add" element={ <AddJob/> } />
                          <Route path="edit/:id" element={ <EditJob/> } />
                      </Route>

                      <Route path='/candidates'>
                          <Route index element={<Candidates />} />
                          <Route path="add" element={ <AddCandidate/> } />
                          <Route path="edit/:id" element={ <EditCandidate/> } />
                      </Route>
                      
                  </Routes>
              </Suspense>
          </div>
    </div>
  );
}

export default App;
