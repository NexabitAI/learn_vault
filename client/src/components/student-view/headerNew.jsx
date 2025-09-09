import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";

import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import CommonForm from "../../common-form";
import { AuthContext } from "@/context/auth-context";
import { signInFormControls, signUpFormControls } from "@/config";

function StudentViewCommonHeaderNew() {
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
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
    signInFormData?.userEmail && signInFormData?.password;

  const checkIfSignUpFormIsValid = () =>
    signUpFormData?.userName && signUpFormData?.userEmail && signUpFormData?.password;

  // Wrap submit to close modal on success
  const onLoginSubmit = async (e) => {
    await handleLoginUser(e);
    // if auth context flips, page content updates automatically
    setAuthOpen(false);
  };
  const onRegisterSubmit = async (e) => {
    await handleRegisterUser(e);
    setAuthOpen(false);
  };

  return (
    <header className="flex items-center justify-between p-4 border-b relative">
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex items-center hover:text-foreground">
          <GraduationCap className="h-8 w-8 mr-4" />
          <span className="font-extrabold md:text-xl text-[14px]">LEARNIFY HUB!</span>
        </Link>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            onClick={() => {
              location.pathname.includes("/courses") ? null : navigate("/courses");
            }}
            className="text-[14px] md:text-[16px] font-medium"
          >
            Explore Courses
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button onClick={() => setAuthOpen(true)}>Sign In</Button>
      </div>

      {/* Auth Modal */}
      <Dialog open={authOpen} onOpenChange={setAuthOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Welcome back</DialogTitle>
          </DialogHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <Card className="p-0 shadow-none border-none">
                <CardHeader className="px-0">
                  <CardTitle>Sign in to your account</CardTitle>
                  <CardDescription>Enter your email and password to access your account</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <CommonForm
                    formControls={signInFormControls}
                    buttonText={"Sign In"}
                    formData={signInFormData}
                    setFormData={setSignInFormData}
                    isButtonDisabled={!checkIfSignInFormIsValid()}
                    handleSubmit={onLoginSubmit}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card className="p-0 shadow-none border-none">
                <CardHeader className="px-0">
                  <CardTitle>Create a new account</CardTitle>
                  <CardDescription>Enter your details to get started</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <CommonForm
                    formControls={signUpFormControls}
                    buttonText={"Sign Up"}
                    formData={signUpFormData}
                    setFormData={setSignUpFormData}
                    isButtonDisabled={!checkIfSignUpFormIsValid()}
                    handleSubmit={onRegisterSubmit}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </header>
  );
}

export default StudentViewCommonHeaderNew;
