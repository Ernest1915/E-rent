import { Plus } from "lucide-react";
import { Button } from "./UI/button";
import { useAuthStore } from "@store/authStore";

interface NavbarProps {
    onAddRental: () => void;
}

const Navbar = ({ onAddRental }: NavbarProps) => {
    const { user } = useAuthStore();

    return (
        <header className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between sticky top-0 z-10">
            <div>
                <h1 className="text-xl font-semibold text-gray-800">Overview</h1>
                <p className="text-xs text-gray-500">Welcome back, {user?.name || "Admin"}</p>
            </div>

            <div className="flex items-center gap-4">
                <Button onClick={onAddRental} size="sm" className="hidden sm:flex">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Rental
                </Button>
                <Button onClick={onAddRental} size="icon" className="sm:hidden">
                    <Plus className="h-4 w-4" />
                </Button>

                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || "A"}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
