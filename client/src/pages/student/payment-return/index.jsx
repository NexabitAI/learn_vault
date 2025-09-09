// src/pages/student/payment-return/index.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { captureAndFinalizePaymentService } from "@/services";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

function PaypalPaymentReturnPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { paymentId, payerId } = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      paymentId: params.get("paymentId"),
      payerId: params.get("PayerID"),
    };
  }, [location.search]);

  const [status, setStatus] = useState(
    paymentId && payerId ? "processing" : "error"
  ); // "processing" | "success" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  const capturePayment = useCallback(async () => {
    if (!paymentId || !payerId) {
      setErrorMsg("Missing payment confirmation parameters.");
      setStatus("error");
      return;
    }

    try {
      setStatus("processing");

      const orderId = JSON.parse(
        sessionStorage.getItem("currentOrderId") || "null"
      );

      if (!orderId) {
        // We can still attempt, but usually this means session expired.
        setErrorMsg("Session expired. Please try purchasing again.");
        setStatus("error");
        return;
      }

      const response = await captureAndFinalizePaymentService(
        paymentId,
        payerId,
        orderId
      );

      if (response?.success) {
        sessionStorage.removeItem("currentOrderId");
        setStatus("success");
        toast.success("Payment successful!");
        // Small delay for UX, then route to My Courses
        setTimeout(() => {
          navigate("/student-courses", { replace: true });
        }, 800);
      } else {
        setErrorMsg(
          response?.message || "We couldn't finalize your payment."
        );
        setStatus("error");
      }
    } catch (err) {
      setErrorMsg(err?.message || "Something went wrong while capturing payment.");
      setStatus("error");
    }
  }, [paymentId, payerId, navigate]);

  useEffect(() => {
    if (status === "processing") {
      capturePayment();
    }
  }, [status, capturePayment]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-4">
          {status === "processing" && (
            <>
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
              <CardTitle className="text-xl font-bold">
                Finalizing your payment…
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Please don’t refresh or close this tab.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="flex items-center justify-center text-green-600">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <CardTitle className="text-xl font-bold">
                Payment successful
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Redirecting you to <span className="font-medium">My Courses</span>…
              </p>
              <div className="pt-2">
                <Button onClick={() => navigate("/student-courses", { replace: true })}>
                  Go to My Courses
                </Button>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <div className="flex items-center justify-center text-red-600">
                <XCircle className="h-10 w-10" />
              </div>
              <CardTitle className="text-xl font-bold">
                Payment could not be completed
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {errorMsg || "Please try again or contact support."}
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                {paymentId && payerId && (
                  <Button onClick={capturePayment}>Try Again</Button>
                )}
                <Button variant="outline" onClick={() => navigate("/courses")}>
                  Back to Courses
                </Button>
              </div>
            </>
          )}
        </CardHeader>
      </Card>
    </div>
  );
}

export default PaypalPaymentReturnPage;
