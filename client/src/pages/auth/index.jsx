// /src/pages/auth/index.jsx
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import StudentHomePageNew from "@/pages/student/home/indexNew";
import CommonForm from "@/components/common-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { X } from "lucide-react";

function AuthPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("signin");

  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
  } = useContext(AuthContext);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, []);

  function checkIfSignInFormIsValid() {
    return (
      signInFormData &&
      signInFormData.userEmail !== "" &&
      signInFormData.password !== ""
    );
  }

  function checkIfSignUpFormIsValid() {
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== ""
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background: your public home page, non-interactive */}
      <div aria-hidden className="pointer-events-none">
        <StudentHomePageNew />
      </div>

      {/* Dim + blur overlay */}
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="relative w-full max-w-lg border-white/20 shadow-2xl bg-card/80 backdrop-blur-xl">
          {/* Close to landing */}
          <button
            onClick={() => navigate("/")}
            className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10 hover:bg-foreground/20 transition"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <Tabs
            value={activeTab}
            defaultValue="signin"
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="px-6 pt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="signin">
              <CardHeader className="pt-4">
                <CardTitle>Sign in to your account</CardTitle>
                <CardDescription>
                  Enter your email and password to access your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControls={signInFormControls}
                  buttonText={"Sign In"}
                  formData={signInFormData}
                  setFormData={setSignInFormData}
                  isButtonDisabled={!checkIfSignInFormIsValid()}
                  handleSubmit={handleLoginUser}
                />
              </CardContent>
            </TabsContent>

            <TabsContent value="signup">
              <CardHeader className="pt-4">
                <CardTitle>Create a new account</CardTitle>
                <CardDescription>
                  Enter your details to get started.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControls={signUpFormControls}
                  buttonText={"Sign Up"}
                  formData={signUpFormData}
                  setFormData={setSignUpFormData}
                  isButtonDisabled={!checkIfSignUpFormIsValid()}
                  handleSubmit={handleRegisterUser}
                />
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

export default AuthPage;
