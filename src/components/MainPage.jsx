import Header from "./Header";
import Footer from "./Footer";
import Card from "./Card";
import Data from "../data.json";

export default function MainPage() {
  const banks = Data.banks;

  return (
    <div className="flex flex-col justify-between items-center h-full">
      <Header />

      <div className="flex flex-col justify-self-start items-center w-full h-full gap-4 m-16">
        {}
        {banks.map((bank) => (
          <Card
            key={bank.id}
            bankName={bank.bankName}
            bankIcon={bank.logo}
            categories={bank.categories}
          />
        ))}
      </div>

      <div className="flex flex-row justify-center items-end">
        <Footer />
      </div>
    </div>
  );
}
