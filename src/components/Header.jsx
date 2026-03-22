export default function Header() {
  return (
    <div className="flex justify-center items-center w-full text-text-primary gap-12">
      <div className="flex justify-start items-center ">
        <img
          src="/pics/AppLogoCropped.png"
          alt="logo"
          className="w-12 h-12 object-contain object-center rounded"
        />
      </div>

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
