export default function Header() {
  return (
    <div className="flex justify-between items-center w-full text-text-primary select-none">
      <div className="flex justify-start items-center ">logo</div>

      <div className="flex justify-center items-center text-xl">
        {/* TODO: Add dynamic time and username */}
        <span className="">Привет, Пупа-Лупа</span>
      </div>

      <div className="flex justify-end items-center">
        <button className=""> notif</button>
        <button className="">+</button>
      </div>
    </div>
  );
}
