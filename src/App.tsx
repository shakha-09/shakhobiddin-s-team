import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { CategoryListingPage } from './pages/CategoryListingPage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { BudgetCalculatorPage } from './pages/BudgetCalculatorPage';
import { MyWeddingPage } from './pages/MyWeddingPage';
import { FavoritesPage } from './pages/FavoritesPage';

// Vendor Pages
import { VendorRegisterPage } from './pages/vendor/VendorRegisterPage';
import { VendorLoginPage } from './pages/vendor/VendorLoginPage';
import { VendorDashboardPage } from './pages/vendor/VendorDashboardPage';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminListings } from './pages/admin/AdminListings';
import { AdminBookings } from './pages/admin/AdminBookings';
import { AdminAvailability } from './pages/admin/AdminAvailability';
import { AdminReviews } from './pages/admin/AdminReviews';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminVendors } from './pages/admin/AdminVendors';

function getInitialPath(): string {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash) {
    return hash.split('?')[0] || '/';
  }
  return window.location.pathname || '/';
}

const AppContent: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(getInitialPath());
  const { isAdminLoggedIn } = useStore();

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getInitialPath());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (path: string) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    window.location.hash = cleanPath;
    setCurrentPath(cleanPath.split('?')[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if current path is an Admin route
  const isAdminRoute = currentPath.startsWith('/admin');

  // Render Admin Section
  if (isAdminRoute) {
    if (!isAdminLoggedIn) {
      return <AdminLoginPage onNavigate={navigate} />;
    }

    let adminComponent = <AdminDashboard onNavigate={navigate} />;
    if (currentPath === '/admin' || currentPath === '/admin/dashboard') {
      adminComponent = <AdminDashboard onNavigate={navigate} />;
    } else if (currentPath === '/admin/wedding-halls') {
      adminComponent = <AdminListings initialCategory="wedding-hall" onNavigate={navigate} />;
    } else if (currentPath === '/admin/cars') {
      adminComponent = <AdminListings initialCategory="car" onNavigate={navigate} />;
    } else if (currentPath === '/admin/artists') {
      adminComponent = <AdminListings initialCategory="artist" onNavigate={navigate} />;
    } else if (currentPath === '/admin/famous-artists') {
      adminComponent = <AdminListings initialCategory="famous-artist" onNavigate={navigate} />;
    } else if (currentPath === '/admin/hosts') {
      adminComponent = <AdminListings initialCategory="host" onNavigate={navigate} />;
    } else if (currentPath === '/admin/entertainers') {
      adminComponent = <AdminListings initialCategory="entertainer" onNavigate={navigate} />;
    } else if (currentPath === '/admin/videographers' || currentPath === '/admin/videochilar') {
      adminComponent = <AdminListings initialCategory="videographer" onNavigate={navigate} />;
    } else if (currentPath === '/admin/listings') {
      adminComponent = <AdminListings onNavigate={navigate} />;
    } else if (currentPath === '/admin/bookings') {
      adminComponent = <AdminBookings onNavigate={navigate} />;
    } else if (currentPath === '/admin/availability') {
      adminComponent = <AdminAvailability />;
    } else if (currentPath === '/admin/reviews') {
      adminComponent = <AdminReviews />;
    } else if (currentPath === '/admin/settings') {
      adminComponent = <AdminSettings />;
    } else if (currentPath === '/admin/vendors') {
      adminComponent = <AdminVendors onNavigate={navigate} />;
    }

    return (
      <AdminLayout currentPath={currentPath} onNavigate={navigate}>
        {adminComponent}
      </AdminLayout>
    );
  }

  // Vendor & Auth Pages (Dedicated layouts)
  if (currentPath === '/vendor-register') {
    return <VendorRegisterPage onNavigate={navigate} />;
  }

  if (currentPath === '/vendor-login' || currentPath === '/kirish' || currentPath === '/login') {
    return <VendorLoginPage onNavigate={navigate} />;
  }

  if (currentPath === '/admin-login') {
    return <VendorLoginPage onNavigate={navigate} initialTab="admin" />;
  }

  if (currentPath === '/kabinet') {
    return <VendorDashboardPage onNavigate={navigate} />;
  }

  // Check for Listing Detail route: e.g. /wedding-halls/:id, /cars/:id, /artists/:id, /videochilar/:id, /detail/:id
  const detailMatch = currentPath.match(/^\/(?:wedding-halls|cars|artists|famous-artists|hosts|entertainers|videochilar|videographers|detail)\/([^/]+)$/);
  if (detailMatch && detailMatch[1]) {
    const listingId = detailMatch[1];
    return (
      <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
        <Header currentPath={currentPath} onNavigate={navigate} />
        <main className="flex-1">
          <ListingDetailPage id={listingId} onNavigate={navigate} />
        </main>
        <Footer onNavigate={navigate} />
      </div>
    );
  }

  // Public View Router
  let mainContent = <HomePage onNavigate={navigate} />;

  switch (currentPath) {
    case '/':
      mainContent = <HomePage onNavigate={navigate} />;
      break;
    case '/search':
      mainContent = <SearchPage onNavigate={navigate} />;
      break;
    case '/wedding-halls':
      mainContent = <CategoryListingPage category="wedding-hall" onNavigate={navigate} />;
      break;
    case '/cars':
      mainContent = <CategoryListingPage category="car" onNavigate={navigate} />;
      break;
    case '/artists':
      mainContent = <CategoryListingPage category="artist" onNavigate={navigate} />;
      break;
    case '/famous-artists':
      mainContent = <CategoryListingPage category="famous-artist" onNavigate={navigate} />;
      break;
    case '/hosts':
      mainContent = <CategoryListingPage category="host" onNavigate={navigate} />;
      break;
    case '/entertainers':
      mainContent = <CategoryListingPage category="entertainer" onNavigate={navigate} />;
      break;
    case '/videochilar':
    case '/videographers':
      mainContent = <CategoryListingPage category="videographer" onNavigate={navigate} />;
      break;
    case '/budget-calculator':
      mainContent = <BudgetCalculatorPage onNavigate={navigate} />;
      break;
    case '/my-wedding':
      mainContent = <MyWeddingPage onNavigate={navigate} />;
      break;
    case '/favorites':
      mainContent = <FavoritesPage onNavigate={navigate} />;
      break;
    default:
      mainContent = <HomePage onNavigate={navigate} />;
      break;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF6F0] text-[#2E1F1A]">
      <Header currentPath={currentPath} onNavigate={navigate} />
      <main className="flex-1">
        {mainContent}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
