import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import CreatePropertyModal from "@/components/CreatePropertyModal";
import { Plus } from "lucide-react";
import { Button } from "@/components/UI/button";
import { syncUserWithDatabase } from "@/appwriteconfig/syncUser";
import { useProperties } from "@/hooks/useProperties";
import { useCreateProperty } from "@/hooks/useCreateProperty";


const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dbuserLoaded, setDbUserLoaded] = useState(false);

  // React Query hooks - automatic caching and refetching!
  const { data: properties = [], isLoading, error } = useProperties();
  const createPropertyMutation = useCreateProperty();

  useEffect(() => {
    setupUser();
  }, []);

  const setupUser = async () => {
    try {
      // Sync user to database (creates DB user if missing)
      await syncUserWithDatabase();
      console.log("User synced with database.");
      setDbUserLoaded(true);
    } catch (error) {
      console.error("Error setting up user:", error);
    }
  };

  const handleCreateProperty = async (newProperty: { property_name: string; location: string }) => {
    try {
      console.log('🚀 Starting property creation:', newProperty);
      // Mutation automatically handles optimistic updates and cache invalidation
      const result = await createPropertyMutation.mutateAsync(newProperty);
      console.log('✅ Property creation returned successfully:', result);
    } catch (error) {
      console.error('❌ Error caught in handleCreateProperty:', error);
      // Re-throw so CreatePropertyModal can handle it
      throw error;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar onAddProperty={() => setIsModalOpen(true)} />

        <main className="flex-1 p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-gray-500">Loading properties...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-red-500">Failed to load properties. Please try again.</div>
            </div>
          ) : properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No properties yet</h3>
              <p className="text-gray-500 max-w-sm">
                Get started by creating your first property to manage units, tenants and payments.
              </p>
              <Button onClick={() => setIsModalOpen(true)}>
                Create First Property
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.$id}
                  propertyId={property.$id}
                  propertyName={property.property_name}
                  location={property.location}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <CreatePropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProperty}
      />
    </div>
  );
};

export default Dashboard;
