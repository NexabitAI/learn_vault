// src/pages/instructor/parts/CourseLanding.jsx (adjust path if needed)
import React, { useContext } from "react";
import FormControls from "@/components/common-form/form-controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courseLandingPageFormControls } from "@/config";
import { InstructorContext } from "@/context/instructor-context";

function CourseLanding() {
  const { courseLandingFormData, setCourseLandingFormData } =
    useContext(InstructorContext);

  return (
    <Card className="border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[var(--shadow)]">
      <CardHeader className="border-b border-[hsl(var(--border))]">
        <CardTitle className="text-lg font-semibold text-[hsl(var(--foreground))]">
          Course Landing Page
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <FormControls
          formControls={courseLandingPageFormControls}
          formData={courseLandingFormData}
          setFormData={setCourseLandingFormData}
        />
      </CardContent>
    </Card>
  );
}

export default CourseLanding;
