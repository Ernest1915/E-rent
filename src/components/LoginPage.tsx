import { useState } from "react";
import { Button } from "@/components/UI/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/UI/card";
import { loginWithGoogle } from "@appwriteconfig/authservices";
import { Loader2, LogIn } from "lucide-react";

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle(); // Redirects automatically
    } catch (err) {
      console.error("Google Login Failed:", err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Admin Login
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <Button
            onClick={handleGoogleLogin}
            className="w-full flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <LogIn className="h-5 w-5" />
            )}
            {loading ? "Redirecting..." : "Login with Google"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
