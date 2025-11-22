import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import RentalCard from "@/components/RentalCard";
import CreateRentalModal from "@/components/CreateRentalModal";
import { Plus } from "lucide-react";
import { Button } from "@/components/UI/button";
import { getRentals, createRental, type Rental } from "@appwriteconfig/db";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const data = await getRentals();
      setRentals(data);
    } catch (error) {
      console.error("Failed to fetch rentals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRental = async (newRental: { unitId: string; unitStatus: string }) => {
    const rental = await createRental(newRental);
    setRentals([rental, ...rentals]);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar onAddRental={() => setIsModalOpen(true)} />

        <main className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-gray-500">Loading rentals...</div>
            </div>
          ) : rentals.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No rental units yet</h3>
              <p className="text-gray-500 max-w-sm">
                Get started by creating your first rental unit to manage tenants and payments.
              </p>
              <Button onClick={() => setIsModalOpen(true)}>
                Create First Unit
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rentals.map((rental) => (
                <RentalCard
                  key={rental.$id}
                  unitId={rental["unit-id"]}
                  unitStatus={rental["unit-status"]}
                  onClick={() => console.log("Clicked rental:", rental["unit-id"])}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <CreateRentalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateRental}
      />
    </div>
  );
};

export default Dashboard;
