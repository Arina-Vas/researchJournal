import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ToastContainer } from 'react-toastify';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './app/router/router';
import { ThemeProvider } from './app/providers/theme-provider/ThemeProvider';
import { QueryProvider } from './app/providers/query-provider/QueryProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      {/*<AuthProvider>*/}
      <QueryProvider>
        <RouterProvider router={router}></RouterProvider>
        <ToastContainer />
      </QueryProvider>
      {/*</AuthProvider>*/}
    </ThemeProvider>
  </StrictMode>,
);

// import { useMedicationById, useMedications } from './api/medications/lib/hooks';
// import { useFetchLocationById, useFetchLocations } from './api/location/lib/hooks';
//
// export const App = () => {
//   const { data } = useMedications();
//   const { data: locations } = useFetchLocations();
//   const { data: location } = useFetchLocationById('loc_vitality_medical');
//   const { data: medication } = useMedicationById('6ab274545e9586a827a229cf');
//
//   console.log(data?.data?.length);
//   console.log(locations?.data?.length);
//   console.log(location?.data);
//   console.log(medication?.data);
//
//   return <div></div>;
// };
