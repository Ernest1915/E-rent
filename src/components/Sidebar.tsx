import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Building2,
    Users,
    Settings,
    LogOut,
    PieChart
} from "lucide-react";
import { useAuthStore } from "@store/authStore";
import { Button } from "./UI/button";

const Sidebar = () => {
    const location = useLocation();
    const { logoutUser } = useAuthStore();

    const navItems = [
        { name: "Overview", path: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
        { name: "Properties", path: "/properties", icon: <Building2 className="h-5 w-5" /> },
        { name: "Tenants", path: "/tenants", icon: <Users className="h-5 w-5" /> },
        { name: "Reports", path: "/reports", icon: <PieChart className="h-5 w-5" /> },
        { name: "Settings", path: "/settings", icon: <Settings className="h-5 w-5" /> },
    ];

    const handleLogout = async () => {
        await logoutUser();
    };

    return (
        <aside className="hidden md:flex w-64 flex-col border-r border-gray-200 bg-white h-screen sticky top-0">
            <div className="p-6 flex items-center gap-2 border-b border-gray-100">
                <Building2 className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold tracking-tight">E-Rent</span>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link key={item.path} to={item.path}>
                            <div
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    }`}
                            >
                                {item.icon}
                                {item.name}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2 h-5 w-5" />
                    Log out
                </Button>
            </div>
        </aside>
    );
};

export default Sidebar;
