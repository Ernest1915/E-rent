import { Link } from "react-router-dom";
import { Button } from "@/components/UI/button";
import { Card, CardContent } from "@/components/UI/card";
import { Building2, CheckCircle, ArrowRight, Shield, Users, Zap } from "lucide-react";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-2">
                        <Building2 className="h-6 w-6 text-blue-600" />
                        <span className="text-xl font-bold tracking-tight">E-Rent Uganda</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login">
                            <Button variant="ghost" className="text-sm font-medium">
                                Log in
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col items-center text-center space-y-8">
                        <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800">
                            <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
                            The #1 Rental Management Solution in Uganda
                        </div>

                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl">
                            Manage your rentals <br className="hidden sm:inline" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                                with confidence and ease
                            </span>
                        </h1>

                        <p className="max-w-[700px] text-lg text-gray-600 md:text-xl leading-relaxed">
                            Streamline your property management, track payments, and manage tenants all in one place.
                            Built specifically for the Ugandan real estate market.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 min-w-[200px]">
                            <Link to="/login">
                                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                                    Start Managing Now
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base border-gray-300 hover:bg-gray-50">
                                View Demo
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Abstract Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[1000px] h-[500px] opacity-30 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 blur-[100px] rounded-full mix-blend-multiply animate-blob"></div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gray-50 mt-24">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Everything you need to run your business</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Powerful features designed to save you time and increase your revenue.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Users className="h-10 w-10 text-blue-600" />,
                                title: "Tenant Management",
                                description: "Keep track of all your tenants, lease agreements, and contact details in one secure database."
                            },
                            {
                                icon: <Zap className="h-10 w-10 text-blue-600" />,
                                title: "Automated Billing",
                                description: "Generate invoices automatically and track payments. Never miss a rent collection again."
                            },
                            {
                                icon: <Shield className="h-10 w-10 text-blue-600" />,
                                title: "Secure & Reliable",
                                description: "Your data is encrypted and backed up. Access your dashboard from anywhere, anytime."
                            }
                        ].map((feature, index) => (
                            <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow duration-200">
                                <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                                    <div className="p-3 bg-blue-50 rounded-full">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-gray-200 bg-white">
                <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-gray-500" />
                        <span className="text-lg font-semibold text-gray-700">E-Rent Uganda</span>
                    </div>
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} E-Rent Uganda. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
