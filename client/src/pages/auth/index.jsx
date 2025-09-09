import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("signin");

  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
  } = useContext(AuthContext);

  // restore redirect path
  const from = location.state?.from || "/";

  // lock scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, []);

  function validSignIn() {
    return !!(signInFormData?.userEmail && signInFormData?.password);
  }
  function validSignUp() {
    return !!(
      signUpFormData?.userName &&
      signUpFormData?.userEmail &&
      signUpFormData?.password
    );
  }

  return (
    <div className="relative min-h-screen">
      <div aria-hidden className="pointer-events-none">
        <StudentHomePageNew />
      </div>

      {/* blur + dim */}
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xl" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="relative w-full max-w-lg">
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
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>Access your account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControls={signInFormControls}
                  buttonText="Sign In"
                  formData={signInFormData}
                  setFormData={setSignInFormData}
                  isButtonDisabled={!validSignIn()}
                  handleSubmit={async (e) => {
                    await handleLoginUser(e);
                    // On success, AuthProvider will update state; just navigate back
                    setTimeout(() => navigate(from), 50);
                  }}
                />
              </CardContent>
            </TabsContent>

            <TabsContent value="signup">
              <CardHeader className="pt-4">
                <CardTitle>Create your account</CardTitle>
                <CardDescription>It only takes a minute.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControls={signUpFormControls}
                  buttonText="Sign Up"
                  formData={signUpFormData}
                  setFormData={setSignUpFormData}
                  isButtonDisabled={!validSignUp()}
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
