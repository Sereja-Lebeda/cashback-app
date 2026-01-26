import Header from "./Header";
import Footer from "./Footer";
import Card from "./Card";
import Data from "../data.json";

export default function MainPage() {
  const banks = Data.banks;

  return (
    <div className="flex flex-col justify-between items-center h-full">
      <Header />

      <div className="flex justify-center items-start w-full h-full gap-4 m-10">
        {banks.map((bank) => (
          <Card
            key={bank.id}
            bankName={bank.bankName}
            bankIcon={bank.logo}
            bankIconType={bank.logoType}
            categories={bank.categories}
          />
        ))}
      </div>

      <div className="flex flex-row justify-center items-start">
        <Footer />
      </div>
    </div>
  );
}
