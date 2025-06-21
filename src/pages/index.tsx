import Navbar from "../../componets/navbar";
import Traffic from "../../componets/traffic";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Use full width container */}
      <div className="w-full p-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 space-y-5">
            <Traffic />
          </div>
        </div>
      </div>
    </>
  );
}
