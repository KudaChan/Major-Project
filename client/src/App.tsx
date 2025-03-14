import { Navbar, Welcome, Transactions, Footer } from './components';

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