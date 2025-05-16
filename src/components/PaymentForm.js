import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { submitRecharge, processPayment } from "../services/api";

function PaymentForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { state } = useLocation();
  const selectedPlan = state?.selectedPlan;
  const mobileNumber = state?.mobileNumber;

  const paymentMode = watch("paymentMode", "");

  if (!selectedPlan || !mobileNumber) {
    return (
      <div
        className="alert alert-warning text-center mt-5 mx-auto"
        style={{ maxWidth: "500px" }}
      >
        No plan or mobile number selected. Please start over.
      </div>
    );
  }

  const onSubmit = async (data) => {
    try {
      setError(null);
      setSuccess(null);

      // Submit recharge
      const rechargeData = { mobileNumber, planId: selectedPlan.id };
      const rechargeResponse = await submitRecharge(rechargeData);

      // Prepare payment details
      let paymentDetails;
      if (data.paymentMode === "UPI") {
        paymentDetails = JSON.stringify({ upiId: data.upiId });
      } else if (
        data.paymentMode === "Credit Card" ||
        data.paymentMode === "Debit Card"
      ) {
        paymentDetails = JSON.stringify({
          cardNumber: data.cardNumber,
          cardholderName: data.cardholderName,
          expiryDate: data.expiryDate,
          cvv: data.cvv,
        });
      } else if (data.paymentMode === "Bank Transfer") {
        paymentDetails = JSON.stringify({
          bankName: data.bankName,
          accountNumber: data.accountNumber,
          ifscCode: data.ifscCode,
          accountHolderName: data.accountHolderName,
        });
      }

      // Process payment
      const paymentData = {
        rechargeId: rechargeResponse.rechargeId,
        paymentMode: data.paymentMode,
        paymentDetails,
      };
      await processPayment(paymentData);

      const successMessage = `Payment successful for ${selectedPlan.name}! Confirmation email sent.`;
      setSuccess(successMessage);
      setTimeout(() => {
        navigate("/validate", { state: { message: successMessage } });
      }, 500);
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.response?.data?.message || "Payment processing failed");
    }
  };

  return (
    <div
      className="card shadow-lg rounded-4 p-5"
      style={{
        maxWidth: "500px",
        margin: "3rem auto",
        backgroundColor: "#fff",
      }}
    >
      <h2 className="card-title text-center mb-4 fw-bold text-primary">
        Payment
      </h2>

      <p className="text-center fs-5 mb-4">
        Plan: <strong>{selectedPlan.name}</strong> (₹
        {selectedPlan.amount || "N/A"})
      </p>

      {success && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          {success}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setSuccess(null)}
          ></button>
        </div>
      )}

      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {error}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-floating mb-4">
          <select
            className={`form-select form-select-lg ${
              errors.paymentMode ? "is-invalid" : ""
            }`}
            style={{ fontSize: "12px" }}
            id="paymentMode"
            {...register("paymentMode", {
              required: "Payment mode is required",
            })}
            aria-label="Select payment mode"
          >
            <option value="">Select Payment Mode</option>
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
          <label htmlFor="paymentMode">Payment Mode</label>
          {errors.paymentMode && (
            <div className="invalid-feedback">{errors.paymentMode.message}</div>
          )}
        </div>

        {paymentMode === "UPI" && (
          <div className="form-floating mb-4">
            <input
              type="text"
              className={`form-control form-control-lg ${
                errors.upiId ? "is-invalid" : ""
              }`}
              id="upiId"
              placeholder="user@upi"
              {...register("upiId", {
                required: "UPI ID is required",
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/,
                  message: "Invalid UPI ID format (e.g., user@upi)",
                },
              })}
              aria-describedby="upiIdHelp"
            />
            <label htmlFor="upiId">UPI ID</label>
            {errors.upiId && (
              <div className="invalid-feedback">{errors.upiId.message}</div>
            )}
          </div>
        )}

        {(paymentMode === "Credit Card" || paymentMode === "Debit Card") && (
          <>
            <div className="form-floating mb-4">
              <input
                type="text"
                className={`form-control form-control-lg ${
                  errors.cardNumber ? "is-invalid" : ""
                }`}
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                {...register("cardNumber", {
                  required: "Card number is required",
                  pattern: {
                    value: /^\d{16}$/,
                    message: "Card number must be 16 digits",
                  },
                })}
              />
              <label htmlFor="cardNumber">Card Number</label>
              {errors.cardNumber && (
                <div className="invalid-feedback">
                  {errors.cardNumber.message}
                </div>
              )}
            </div>
            <div className="form-floating mb-4">
              <input
                type="text"
                className={`form-control form-control-lg ${
                  errors.cardholderName ? "is-invalid" : ""
                }`}
                id="cardholderName"
                placeholder="John Doe"
                {...register("cardholderName", {
                  required: "Cardholder name is required",
                  pattern: {
                    value: /^[a-zA-Z\s]+$/,
                    message: "Name must contain only letters and spaces",
                  },
                })}
              />
              <label htmlFor="cardholderName">Cardholder Name</label>
              {errors.cardholderName && (
                <div className="invalid-feedback">
                  {errors.cardholderName.message}
                </div>
              )}
            </div>
            <div className="row g-3 mb-4">
              <div className="col-md-6 form-floating">
                <input
                  type="text"
                  className={`form-control form-control-lg ${
                    errors.expiryDate ? "is-invalid" : ""
                  }`}
                  id="expiryDate"
                  placeholder="MM/YY"
                  {...register("expiryDate", {
                    required: "Expiry date is required",
                    pattern: {
                      value: /^(0[1-9]|1[0-2])\/([2-9][0-9])$/,
                      message: "Invalid format (MM/YY, e.g., 08/27)",
                    },
                    validate: (value) => {
                      const [month, year] = value.split("/");
                      const expiry = new Date(`20${year}`, month - 1);
                      const now = new Date();
                      return expiry > now || "Card has expired";
                    },
                  })}
                />
                <label htmlFor="expiryDate">Expiry Date (MM/YY)</label>
                {errors.expiryDate && (
                  <div className="invalid-feedback">
                    {errors.expiryDate.message}
                  </div>
                )}
              </div>
              <div className="col-md-6 form-floating">
                <input
                  type="text"
                  className={`form-control form-control-lg ${
                    errors.cvv ? "is-invalid" : ""
                  }`}
                  id="cvv"
                  placeholder="123"
                  {...register("cvv", {
                    required: "CVV is required",
                    pattern: {
                      value: /^\d{3}$/,
                      message: "CVV must be 3 digits",
                    },
                  })}
                />
                <label htmlFor="cvv">CVV</label>
                {errors.cvv && (
                  <div className="invalid-feedback">{errors.cvv.message}</div>
                )}
              </div>
            </div>
          </>
        )}

        {paymentMode === "Bank Transfer" && (
          <>
            <div className="form-floating mb-4">
              <select
                className={`form-select form-select-lg ${
                  errors.bankName ? "is-invalid" : ""
                }`}
                id="bankName"
                {...register("bankName", {
                  required: "Bank name is required",
                })}
              >
                <option value="">Select Bank</option>
                <option value="Bank of America">Bank of America</option>
                <option value="Chase">Chase</option>
                <option value="Wells Fargo">Wells Fargo</option>
                <option value="Citibank">Citibank</option>
                {/* Add more banks as needed */}
              </select>
              <label htmlFor="bankName">Bank Name</label>
              {errors.bankName && (
                <div className="invalid-feedback">
                  {errors.bankName.message}
                </div>
              )}
            </div>

            <div className="form-floating mb-4">
              <input
                type="text"
                className={`form-control form-control-lg ${
                  errors.accountNumber ? "is-invalid" : ""
                }`}
                id="accountNumber"
                placeholder="Account Number"
                {...register("accountNumber", {
                  required: "Account number is required",
                  pattern: {
                    value: /^\d{9,18}$/,
                    message: "Account number must be 9-18 digits",
                  },
                })}
              />
              <label htmlFor="accountNumber">Account Number</label>
              {errors.accountNumber && (
                <div className="invalid-feedback">
                  {errors.accountNumber.message}
                </div>
              )}
            </div>

            <div className="form-floating mb-4">
              <input
                type="text"
                className={`form-control form-control-lg ${
                  errors.ifscCode ? "is-invalid" : ""
                }`}
                id="ifscCode"
                placeholder="IFSC Code"
                {...register("ifscCode", {
                  required: "IFSC code is required",
                  pattern: {
                    value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                    message: "Invalid IFSC code format",
                  },
                })}
              />
              <label htmlFor="ifscCode">IFSC Code</label>
              {errors.ifscCode && (
                <div className="invalid-feedback">
                  {errors.ifscCode.message}
                </div>
              )}
            </div>

            <div className="form-floating mb-4">
              <input
                type="text"
                className={`form-control form-control-lg ${
                  errors.accountHolderName ? "is-invalid" : ""
                }`}
                id="accountHolderName"
                placeholder="Account Holder Name"
                {...register("accountHolderName", {
                  required: "Account holder name is required",
                  pattern: {
                    value: /^[a-zA-Z\s]+$/,
                    message: "Name must contain only letters and spaces",
                  },
                })}
              />
              <label htmlFor="accountHolderName">Account Holder Name</label>
              {errors.accountHolderName && (
                <div className="invalid-feedback">
                  {errors.accountHolderName.message}
                </div>
              )}
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary btn-lg w-100 mt-3">
          Pay Now
        </button>

        <button
          type="button"
          className="btn btn-outline-secondary mb-3 mt-3"
          onClick={() => navigate(-1)} // navigates back one step
        >
          ← Go Back
        </button>
      </form>
    </div>
  );
}

export default PaymentForm;
