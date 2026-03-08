import React, { Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import Welcome from './components/Welcome';
import { ErrorBoundary } from './components/ErrorBoundary';
import Loading from './components/Loading';
import { getProblemById } from './problemRegistry';
import { getAptitudeNoteById } from './aptitudeRegistry';

// Wrapper to render a problem based on ID with Suspense and Error Boundary
const ProblemWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const problem = getProblemById(id || '');

  if (!problem) {
    return <Navigate to="/" replace />;
  }

  const Component = problem.component;

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
};

// Wrapper to render aptitude notes based on ID
const AptitudeWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const note = getAptitudeNoteById(id || '');

  if (!note) {
    return <Navigate to="/" replace />;
  }

  const Component = note.component;

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Landing Page - No Sidebar */}
        <Route path="/" element={<Welcome />} />
        
        {/* Application Layout - Contains Sidebar */}
        <Route element={<Layout />}>
          <Route path="problem/:id" element={<ProblemWrapper />} />
          <Route path="aptitude/:id" element={<AptitudeWrapper />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;