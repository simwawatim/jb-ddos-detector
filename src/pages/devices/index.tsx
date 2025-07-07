import Navbar from "../../../componets/navbar";
import DevicesTable from "./componets/device-table";    

export default function Devices() {
    return (
       <>
      <Navbar />

      <div className="w-full p-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 space-y-5">
           <DevicesTable/>
          </div>
        </div>
      </div>
    </>
    );
}
