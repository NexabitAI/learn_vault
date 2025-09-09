// src/components/common-form/CommonForm.jsx
import React from "react";
import { Button } from "../ui/button";
import FormControls from "./form-controls";

function CommonForm({
  handleSubmit,
  buttonText,
  formControls = [],
  formData,
  setFormData,
  isButtonDisabled = false,
  className = "",
}) {
  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="on"
      className={`
        bg-[hsl(var(--card))]
        text-[hsl(var(--foreground))]
        border border-[hsl(var(--border))]
        rounded-[var(--radius)]
        shadow-[var(--shadow)]
        p-4 md:p-6
        space-y-4
        transition-shadow duration-150
        focus-within:ring-2 focus-within:ring-[hsl(var(--ring))]
        focus-within:ring-offset-2 focus-within:ring-offset-[hsl(var(--background))]
        ${className}
      `}
    >
      {/* Fields */}
      <FormControls
        formControls={formControls}
        formData={formData}
        setFormData={setFormData}
      />

      {/* Submit */}
      <Button
        disabled={isButtonDisabled}
        type="submit"
        className="mt-2 w-full"
      >
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
