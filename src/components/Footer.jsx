const QUOTES = [
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
    quote: '"Искусство не в том, чтобы зарабатывать, а в том, чтобы сохранять"',
    author: "Английская пословица",
  },
];

const RANDOM_QUOTE = QUOTES[Math.floor(Math.random() * QUOTES.length)];

export default function Footer() {
  const randomQuote = RANDOM_QUOTE;

  return (
    <div className="flex flex-col justify-center items-center w-full h-full shrink-0 gap-2 select-none">
      {/* TODO: add dynamic quotes */}
      <span className="min-w-full min-h-[80px] h-auto flex items-center text-md font-bold text-text-primary text-center line-clamp-2">
        {randomQuote.quote}
      </span>
      <span className="text-md text-text-primary text-center">
        {randomQuote.author}
      </span>
    </div>
  );
}
