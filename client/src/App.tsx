/**
 * App.tsx
 * 
 * Main application component that structures the overall layout.
 * Imports and arranges all major components including Navbar, Welcome, 
 * Transactions, and Footer.
 * 
 * The application uses a gradient background and responsive layout.
 */
import { Navbar, Welcome, Transactions, Footer } from './components';

/**
 * App component
 * Root component that structures the application layout
 */
const App = () => {
  return (
    <div className="min-h-screen pt-20"> {/* Added pt-20 for padding-top */}
      <div className="gradient-bg-welcome">
        <Navbar />
        <Welcome />
      </div>
      <Transactions />
      <Footer />
    </div>
  )
}

export default App;
