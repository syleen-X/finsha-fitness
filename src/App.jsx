import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useBooking } from './hooks/useBooking';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ClassesPage from './pages/ClassesPage';
import ClassDetailPage from './pages/ClassDetailPage';
import BookingPage from './pages/BookingPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import NotFoundPage from './pages/NotFoundPage';
import './styles/global.css';

function App() {
  const bookingState = useBooking();

  return (
    <BrowserRouter>
      <Navbar bookingCount={bookingState.totalSessions} />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/classes" element={<ClassesPage {...bookingState} />} />
          <Route path="/classes/:id" element={<ClassDetailPage {...bookingState} />} />
          <Route path="/booking" element={<BookingPage {...bookingState} />} />
          <Route
            path="/checkout"
            element={
              <CheckoutPage
                booking={bookingState.booking}
                total={bookingState.total}
                clearBooking={bookingState.clearBooking}
              />
            }
          />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
