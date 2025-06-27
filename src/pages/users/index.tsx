import Navbar from "../../../componets/navbar";
import Users from "../../../componets/users-table";

export default function UsersPage() {
  return (
    <>
      <Navbar />

      {/* Use full width container */}
      <div className="w-full p-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 space-y-5">
           <Users/>
          </div>
        </div>
      </div>
    </>
  );
}