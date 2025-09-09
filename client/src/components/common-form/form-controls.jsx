// src/components/form-controls/FormControls.jsx
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

function FormControls({ formControls = [], formData, setFormData }) {
  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function renderComponentByType(ctrl) {
    const value = formData[ctrl.name] ?? "";

    switch (ctrl.componentType) {
      case "select":
        return (
          <Select
            value={value}
            onValueChange={(v) => handleChange(ctrl.name, v)}
          >
            <SelectTrigger
              className="
                w-full
                bg-[hsl(var(--card))]
                text-[hsl(var(--foreground))]
                border-[hsl(var(--border))]
                rounded-[var(--radius)]
                focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-[hsl(var(--ring))]
              "
            >
              <SelectValue placeholder={ctrl.label} />
            </SelectTrigger>
            <SelectContent
              className="
                bg-[hsl(var(--card))]
                text-[hsl(var(--foreground))]
                border-[hsl(var(--border))]
                rounded-[calc(var(--radius)-2px)]
                shadow-[var(--shadow)]
              "
            >
              {Array.isArray(ctrl.options) && ctrl.options.length > 0
                ? ctrl.options.map((opt) => (
                    <SelectItem key={String(opt.id)} value={String(opt.id)}>
                      {opt.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );

      case "textarea":
        return (
          <Textarea
            id={ctrl.name}
            name={ctrl.name}
            placeholder={ctrl.placeholder}
            value={value}
            onChange={(e) => handleChange(ctrl.name, e.target.value)}
            className="
              bg-[hsl(var(--card))]
              text-[hsl(var(--foreground))]
              placeholder:text-[hsl(var(--muted-foreground))]/80
              border-[hsl(var(--border))]
              rounded-[var(--radius)]
              focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-[hsl(var(--ring))]
              min-h-[120px]
              resize-y
            "
          />
        );

      case "input":
      default:
        return (
          <Input
            id={ctrl.name}
            name={ctrl.name}
            type={ctrl.type}
            placeholder={ctrl.placeholder}
            value={value}
            onChange={(e) => handleChange(ctrl.name, e.target.value)}
            className="
              bg-[hsl(var(--card))]
              text-[hsl(var(--foreground))]
              placeholder:text-[hsl(var(--muted-foreground))]/80
              border-[hsl(var(--border))]
              rounded-[var(--radius)]
              focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-[hsl(var(--ring))]
            "
          />
        );
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {formControls.map((ctrl) => {
        const hasHint = Boolean(ctrl.hint);
        const hasError = Boolean(ctrl.error);

        return (
          <div
            key={ctrl.name}
            className="
              flex flex-col gap-2 p-0
            "
          >
            {/* Label row */}
            <div className="flex items-center justify-between">
              <Label
                htmlFor={ctrl.name}
                className="
                  text-sm font-medium
                  text-[hsl(var(--foreground))]
                "
              >
                {ctrl.label}
                {ctrl.required ? (
                  <sup className="ml-1 text-[hsl(var(--destructive))]">*</sup>
                ) : null}
              </Label>

              {/* Optional right-aligned hint */}
              {hasHint ? (
                <span className="text-xs text-[hsl(var(--muted-foreground))]">
                  {ctrl.hint}
                </span>
              ) : null}
            </div>

            {/* Control */}
            {renderComponentByType(ctrl)}

            {/* Optional error text */}
            {hasError ? (
              <p className="text-xs text-[hsl(var(--destructive))] mt-1">
                {ctrl.error}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default FormControls;
