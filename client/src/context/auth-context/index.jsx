// src/context/auth-context/index.jsx
import React, { createContext, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  initialSignInFormData,
  initialSignUpFormData,
} from "@/config";
import {
  checkAuthService,
  loginService,
  registerService,
} from "@/services";
import { toast } from "react-toastify";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);

  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });

  // initial auth check loading
  const [loading, setLoading] = useState(true);

  async function handleRegisterUser(event) {
    event.preventDefault();
    try {
      const data = await registerService(signUpFormData);
      if (data?.success) {
        toast.success("Registration successful!");
        // Let the user sign in after registration
      } else {
        toast.error(data?.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error(error?.message || "Registration error. Please try again.");
    }
  }

  async function handleLoginUser(event) {
    event.preventDefault();
    try {
      const data = await loginService(signInFormData);
      if (data?.success) {
        // Persist access token for subsequent requests
        sessionStorage.setItem("accessToken", JSON.stringify(data.data.accessToken));
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        toast.success("Login successful!");
      } else {
        setAuth({ authenticate: false, user: null });
        toast.error(data?.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setAuth({ authenticate: false, user: null });
      toast.error(error?.message || "An unexpected error occurred.");
    }
  }

  async function checkAuthUser() {
    setLoading(true);
    try {
      const data = await checkAuthService();
      if (data?.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
      } else {
        setAuth({ authenticate: false, user: null });
      }
    } catch (error) {
      setAuth({ authenticate: false, user: null });
    } finally {
      setLoading(false);
    }
  }

  function resetCredentials() {
    try {
      sessionStorage.removeItem("accessToken");
    } catch {
      // ignore storage errors
    }
    setAuth({ authenticate: false, user: null });
  }

  useEffect(() => {
    checkAuthUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        resetCredentials,
      }}
    >
      {loading ? (
        <div
          className="
            min-h-screen
            bg-[hsl(var(--background))] text-[hsl(var(--foreground))]
            flex items-center justify-center p-6
          "
          aria-busy="true"
        >
          <div className="w-full max-w-md space-y-3">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-11/12" />
            <Skeleton className="h-9 w-10/12" />
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
