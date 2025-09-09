// src/pages/auth/index.jsx
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
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
import { GraduationCap } from "lucide-react";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
  } = useContext(AuthContext);

  const checkIfSignInFormIsValid = () =>
    Boolean(signInFormData?.userEmail && signInFormData?.password);

  const checkIfSignUpFormIsValid = () =>
    Boolean(
      signUpFormData?.userName &&
        signUpFormData?.userEmail &&
        signUpFormData?.password
    );

  return (
    <div
      className="
        min-h-screen flex flex-col
        bg-[hsl(var(--background))] text-[hsl(var(--foreground))]
      "
    >
      {/* Header */}
      <header className="h-14 border-b border-[hsl(var(--border))]">
        <div className="container h-full flex items-center">
          <Link
            to="/"
            className="flex items-center gap-3 hover:no-underline text-[hsl(var(--foreground))]"
            aria-label="Go to home"
          >
            <GraduationCap className="h-6 w-6 opacity-90" />
            <span className="font-extrabold text-lg tracking-tight">
              LEARNIFY HUB
            </span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin" aria-controls="signin-panel">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" aria-controls="signup-panel">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" id="signin-panel">
              <Card className="space-y-4">
                <CardHeader className="border-b border-[hsl(var(--border))]">
                  <CardTitle>Sign in to your account</CardTitle>
                  <CardDescription>
                    Enter your email and password to access your account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <CommonForm
                    formControls={signInFormControls}
                    buttonText="Sign In"
                    formData={signInFormData}
                    setFormData={setSignInFormData}
                    isButtonDisabled={!checkIfSignInFormIsValid()}
                    handleSubmit={handleLoginUser}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup" id="signup-panel">
              <Card className="space-y-4">
                <CardHeader className="border-b border-[hsl(var(--border))]">
                  <CardTitle>Create a new account</CardTitle>
                  <CardDescription>
                    Enter your details to get started.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <CommonForm
                    formControls={signUpFormControls}
                    buttonText="Sign Up"
                    formData={signUpFormData}
                    setFormData={setSignUpFormData}
                    isButtonDisabled={!checkIfSignUpFormIsValid()}
                    handleSubmit={handleRegisterUser}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
