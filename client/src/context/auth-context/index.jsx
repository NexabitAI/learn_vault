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
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(
    initialSignInFormData
  );
  const [signUpFormData, setSignUpFormData] = useState(
    initialSignUpFormData
  );
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  async function handleRegisterUser(event) {
    event.preventDefault();

    try {
      const data = await registerService(signUpFormData);

      if (data.success) {
        toast.success("Registration successful!");
        window.location.reload();
      } else {
        toast.error(
          data.message ||
            "Registration failed. Please try again."
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleLoginUser(event) {
    event.preventDefault();

    try {
      const data = await loginService(signInFormData);

      if (data.success) {
        sessionStorage.setItem(
          "accessToken",
          JSON.stringify(data.data.accessToken)
        );
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        toast.success("Login successful!");
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
        toast.error(
          data.message || "Login failed. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        error.message || "An unexpected error occurred."
      );
    }
  }

  //check auth user

  async function checkAuthUser() {
    try {
      const data = await checkAuthService();

      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        setLoading(false);
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
    } catch (error) {
      if (!error?.response?.data?.success) {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
    }
  }

  function resetCredentials() {
    setAuth({
      authenticate: false,
      user: null,
    });
  }

  useEffect(() => {
    checkAuthUser();
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
      }}>
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}
