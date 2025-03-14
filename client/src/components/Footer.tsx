const Footer = () => (
  <div className="w-full flex md:justify-center justify-between items-center flex-col p-4 gradient-bg-footer">
    <div className="w-full flex sm:flex-row flex-col justify-center items-center my-4">
      <div className="flex flex-[0.5] justify-center items-center">
        <span className="text-xl font-bold text-white w-32">BlockPay</span>
      </div>
    </div>

    <div className="flex justify-center items-center flex-col mt-5">
      <p className="text-white text-sm text-center">Come join us and hear for the unexpected miracle</p>
    </div>

    <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5 " />

    <div className="sm:w-[90%] w-full flex justify-between items-center mt-3">
      <p className="text-white text-left text-xs">@chandankumar2025</p>
      <p className="text-white text-right text-xs">All rights reserved</p>
    </div>
  </div>
);

export default Footer;