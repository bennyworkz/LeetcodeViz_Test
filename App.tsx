import React, { Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import Welcome from './components/Welcome';
import { ErrorBoundary } from './components/ErrorBoundary';
import Loading from './components/Loading';
import { getProblemById } from './problemRegistry';

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

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Welcome />} />
          <Route path="problem/:id" element={<ProblemWrapper />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
