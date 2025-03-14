import { BsShieldFillCheck } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";
import { RiHeart2Fill } from "react-icons/ri";
import { JSX } from "react";

const ServiceCard = ({ color, title, icon, subtitle }: { color: string, title: string, icon: JSX.Element, subtitle: string }) => (
  <div className="flex flex-row justify-start items-start white-glassmorphism p-3 m-2 cursor-pointer hover:shadow-xl max-w-[420px]">
    <div className={`w-10 h-10 rounded-full flex justify-center items-center ${color}`}>
      {icon}
    </div>
    <div className="ml-5 flex flex-col flex-1">
      <h3 className="mt-2 text-white text-lg">{title}</h3>
      <p className="mt-1 text-white text-sm">
        {subtitle}
      </p>
    </div>
  </div>
);

const Services = () => (
  <div className="flex w-full justify-center items-center gradient-bg-services">
    <div className="flex flex-col items-center py-12 px-4 max-w-[800px]">
      <h1 className="text-white text-3xl sm:text-5xl py-2 text-gradient text-center">
        Secure Crypto Payments
        <br />
        Made Simple
      </h1>
      <p className="text-center my-2 text-white font-light text-base max-w-[600px] mb-10">
        Experience the future of digital transactions with our enterprise-grade blockchain payment solution. 
        Fast, secure, and cost-effective for businesses and individuals alike.
      </p>

      <div className="flex flex-col items-center gap-4">
        <ServiceCard
          color="bg-[#2952E3]"
          title="Bank-Grade Security"
          icon={<BsShieldFillCheck fontSize={21} className="text-white" />}
          subtitle="Multi-signature wallets, end-to-end encryption, and real-time fraud detection ensure your transactions are always protected."
        />
        <ServiceCard
          color="bg-[#8945F8]"
          title="Smart Exchange Rates"
          icon={<BiSearchAlt fontSize={21} className="text-white" />}
          subtitle="Get the best rates with our AI-powered exchange system that aggregates prices from major DEXs and ensures optimal conversion."
        />
        <ServiceCard
          color="bg-[#F84550]"
          title="Lightning Fast Transfers"
          icon={<RiHeart2Fill fontSize={21} className="text-white" />}
          subtitle="Experience near-instant settlements with our Layer 2 integration. Send and receive payments globally in seconds, not hours."
        />
      </div>
    </div>
  </div>
);

export default Services;