export default function Header() {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex justify-start items-center text-black">logo</div>

      <div className="flex justify-center items-center text-xl">
        {/* TODO: Add dynamic time and username */}
        <span className="text-black">Good morning, User</span>
      </div>

      <div className="flex justify-end items-center">
        <button className="text-black"> notif</button>
        <button className="text-black">+</button>
      </div>
    </div>
  );
}
