import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const ADMIN_PASSWORD = "godavari2024";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("tog-admin", "true");
      navigate("/admin");
    } else {
      toast.error("Incorrect password");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-20 bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-lg font-bold text-foreground">Admin Login</h1>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-card rounded-lg shadow-xl border border-border p-8 w-full max-w-sm animate-fade-in">
          <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-6">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-xl font-bold text-center text-foreground mb-6">Admin Access</h2>
          <Input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="h-12 rounded-lg bg-background border-border mb-4"
          />
          <Button
            onClick={handleLogin}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-semibold"
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
