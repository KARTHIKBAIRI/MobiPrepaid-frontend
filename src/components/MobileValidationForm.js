import { useState } from "react";
import { useForm } from "react-hook-form";
import { validateMobile } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function MobileValidationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const isValid = await validateMobile(data);
      if (isValid) {
        navigate("/plans", { state: { mobileNumber: data.mobileNumber } });
      } else {
        setError("Mobile number is not registered or not active");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to validate mobile number"
      );
    }
  };

  return (
    <div
      className="card shadow-lg rounded-4 p-4"
      style={{ maxWidth: "420px", margin: "4rem auto", backgroundColor: "#f8f9fa" }}
    >
      <h2 className="card-title text-center mb-4 fw-bold text-primary">
        Validate Mobile Number
      </h2>
      
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
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
          <input
            type="text"
            className={`form-control form-control-lg ${
              errors.mobileNumber ? "is-invalid" : ""
            }`}
            id="mobileNumber"
            placeholder="Mobile Number"
            {...register("mobileNumber", {
              required: "Mobile number is required",
              pattern: {
                value: /^[6-9][0-9]{9}$/,
                message: "Mobile number must be 10 digits starting with 6-9",
              },
            })}
          />
          <label htmlFor="mobileNumber">
            📱 Mobile Number
          </label>
          {errors.mobileNumber && (
            <div className="invalid-feedback">{errors.mobileNumber.message}</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary btn-lg w-100 shadow-sm">
          Validate
        </button>
      </form>

      <div className="mt-4 text-center text-muted">
        <p>
          Not registered?{" "}
          <Link to="/register" className="text-decoration-none fw-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default MobileValidationForm;
