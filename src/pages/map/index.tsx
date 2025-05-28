import Navbar from "../../../componets/navbar";
import SideNav from "../../../componets/side-nav";


import dynamic from 'next/dynamic';


const MapView = dynamic(() => import('../../../componets/mapview'), { ssr: false });


export default function MapPage() {
  return (
    <>
      <Navbar />

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4">
            <SideNav />
          </div>

          <div className="col-span-12 md:col-span-8 space-y-5">
            <h1 className="text-2xl font-bold mb-4">Network Map</h1>
            <MapView />
          </div>
        </div>
      </div>
    </>
  );
}
