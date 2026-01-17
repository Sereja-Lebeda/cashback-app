export default function Footer() {
  const Quotes = [
    {
      quote: '"Сбережённая монета равна заработанной"',
      author: "Бенджамин Франклин",
    },
    {
      quote:
        '"Если хочешь быть богатым, думай не только о заработке, но и об экономии"',
      author: "Бенджамин Франклин",
    },
    {
      quote:
        '"Тот, кто умеет и тратить, и копить, — самый счастливый человек: он знает обе радости"',
      author: "Сэмюэл Джонсон",
    },
    {
      quote:
        '"Можно зарабатывать больше или тратить меньше — всего два способа управлять деньгами"',
      author: "Джон Хоуп Брайант",
    },
    {
      quote: '"Если не умеешь сокращать расходы, придётся страдать"',
      author: "Конфуций",
    },
    {
      quote: '"Копи деньги — и деньги спасут тебя"',
      author: "Ямайская пословица",
    },
    {
      quote:
        '"Искусство не в том, чтобы зарабатывать, а в том, чтобы сохранять"',
      author: "Английская пословица",
    },
    // {
    //   quote: '""',
    //   author: "",
    // },
    // {
    //   quote: '""',
    //   author: "",
    // },
    // {
    //   quote: '""',
    //   author: "",
    // },
  ];

  const randomQuote = Quotes[Math.floor(Math.random() * Quotes.length)];

  return (
    <div className="flex flex-col justify-center items-center w-full h-full gap-2">
      {/* TODO: add dynamic quotes */}
      <span className="text-md font-bold text-text-primary text-center">
        {randomQuote.quote}
      </span>
      <span className="text-md text-text-primary text-center">
        {randomQuote.author}
      </span>
    </div>
  );
}
