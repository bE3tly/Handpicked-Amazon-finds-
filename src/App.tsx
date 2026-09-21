/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { PublicView } from './components/PublicView';
import { AdminView } from './components/AdminView';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicView />} />
          <Route path="/admin" element={<AdminView />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
