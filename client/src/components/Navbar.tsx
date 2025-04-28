import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { useState, useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import AccountSelector from "./AccountSelector";

const NavBarItem = ({ title, classprops } : { title: string, classprops?: string }) => (
  <li className={`mx-4 cursor-pointer ${classprops}`}>{title}</li>
);

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const { currentAccount, accounts } = useContext(TransactionContext);
  
  // Debug log
  console.log("Navbar render - currentAccount:", currentAccount);
  console.log("Navbar render - accounts:", accounts);

  return (
    <nav className="fixed top-0 left-0 right-0 w-full flex md:justify-center justify-between items-center p-4 backdrop-blur-sm bg-transparent bg-opacity-50 z-50">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <span className="text-xl font-bold text-white w-32">BlockPay</span>
      </div>
      
      <div className="flex items-center">
        {currentAccount && <AccountSelector />}
        
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd] text-white">
            Pay Now
        </button>
      </div>
      
      <div className="flex relative">
        {!toggleMenu && (
          <HiMenuAlt4 fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(true)} />
        )}
        {toggleMenu && (
          <AiOutlineClose fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(false)} />
        )}
        {toggleMenu && (
          <ul
            className="z-10 fixed -top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
            flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in"
          >
            <li className="text-xl w-full my-2"><AiOutlineClose onClick={() => setToggleMenu(false)} /></li>
            {["Market", "Exchange", "Tutorials", "Wallets"].map(
              (item, index) => <NavBarItem key={item + index} title={item} classprops="my-2 text-lg" />,
            )}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
