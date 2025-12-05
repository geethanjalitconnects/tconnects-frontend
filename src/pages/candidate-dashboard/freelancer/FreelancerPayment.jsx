import React, { useState, useEffect } from "react";
import api from "../../../config/api";
import toast from "react-hot-toast";
import "./Freelancer.css";

export default function FreelancerPayment() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Empty new entry template (only UI, no API yet)
  const emptyMethod = {
    id: null,
    payment_type: "UPI",
    upi_id: "",
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
  };

  // ======================================================
  // 1️⃣ LOAD EXISTING METHODS (GET)
  // ======================================================
  useEffect(() => {
    const loadMethods = async () => {
      try {
        const res = await api.get("/api/profiles/freelancer/payment-methods/");
        setMethods(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        toast.error("Unable to load payment methods.");
        setMethods([]);
      } finally {
        setLoading(false);
      }
    };

    loadMethods();
  }, []);

  // ======================================================
  // 2️⃣ SAFELY CONVERT "" → null (fixes backend 400)
  // ======================================================
  const normalize = (obj) => {
    const fixed = { ...obj };
    Object.keys(fixed).forEach((k) => {
      if (fixed[k] === "") fixed[k] = null;
    });
    return fixed;
  };

  // ======================================================
  // 3️⃣ VALIDATE BEFORE API CALL
  // ======================================================
  const validate = (m) => {
    if (m.payment_type === "UPI") {
      if (!m.upi_id) {
        toast.error("UPI ID is required.");
        return false;
      }
    }

    if (m.payment_type === "Bank") {
      if (!m.account_holder_name || !m.account_number || !m.ifsc_code) {
        toast.error("Please fill all bank details.");
        return false;
      }
    }

    return true;
  };

  // ======================================================
  // 4️⃣ ADD METHOD (LOCAL ONLY) — NO VALIDATION, NO API!!
  // ======================================================
  const addMethod = () => {
    setMethods((prev) => [...prev, { ...emptyMethod }]);
  };

  // ======================================================
  // 5️⃣ UPDATE A FIELD
  // ======================================================
  const updateField = (index, field, value) => {
    setMethods((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  };

  // ======================================================
  // 6️⃣ DELETE METHOD
  // ======================================================
  const removeMethod = async (id, index) => {
    // If it's a new unsaved entry → remove directly
    if (!id) {
      setMethods((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    try {
      await api.delete(`/api/profiles/freelancer/payment-methods/${id}/`);
      setMethods((prev) => prev.filter((m) => m.id !== id));
      toast.success("Payment method deleted.");
    } catch (error) {
      toast.error("Unable to delete payment method.");
    }
  };

  // ======================================================
  // 7️⃣ SAVE ALL (POST new + PATCH existing)
  // ======================================================
  const saveAll = async (e) => {
    e.preventDefault();

    try {
      for (const method of methods) {
        if (!validate(method)) return;

        const payload = normalize({
          payment_type: method.payment_type,
          upi_id: method.payment_type === "UPI" ? method.upi_id : null,
          account_holder_name:
            method.payment_type === "Bank" ? method.account_holder_name : null,
          account_number:
            method.payment_type === "Bank" ? method.account_number : null,
          ifsc_code:
            method.payment_type === "Bank" ? method.ifsc_code : null,
        });

        if (!method.id) {
          // Create a new payment method
          const res = await api.post(
            "/api/profiles/freelancer/payment-methods/",
            payload
          );
          method.id = res.data.id; // update local id
        } else {
          // Update existing method
          await api.patch(
            `/api/profiles/freelancer/payment-methods/${method.id}/`,
            payload
          );
        }
      }

      toast.success("Payment methods saved successfully!");
    } catch (error) {
      console.log(error.response?.data);
      toast.error("Failed to save payment methods.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="fr-page">
      <form className="fr-card fr-form" onSubmit={saveAll}>
        <h2 className="fr-title">Payment Methods</h2>

        {methods.length === 0 && (
          <p className="fr-empty">No payment methods added yet.</p>
        )}

        {methods.map((method, index) => (
          <div key={index} className="fr-payment-block">
            {/* PAYMENT TYPE */}
            <div className="fr-row fr-two-col">
              <div>
                <label className="fr-label">Payment Type</label>
                <select
                  className="fr-input"
                  value={method.payment_type}
                  onChange={(e) =>
                    updateField(index, "payment_type", e.target.value)
                  }
                >
                  <option value="UPI">UPI</option>
                  <option value="Bank">Bank Transfer</option>
                </select>
              </div>

              <button
                type="button"
                className="fr-btn fr-btn-danger remove-btn"
                onClick={() => removeMethod(method.id, index)}
              >
                Remove
              </button>
            </div>

            {/* UPI FIELDS */}
            {method.payment_type === "UPI" && (
              <div className="fr-row">
                <label className="fr-label">UPI ID</label>
                <input
                  className="fr-input"
                  placeholder="yourname@upi"
                  value={method.upi_id || ""}
                  onChange={(e) =>
                    updateField(index, "upi_id", e.target.value)
                  }
                />
              </div>
            )}

            {/* BANK FIELDS */}
            {method.payment_type === "Bank" && (
              <>
                <div className="fr-row">
                  <label className="fr-label">Account Holder Name</label>
                  <input
                    className="fr-input"
                    placeholder="Full Name"
                    value={method.account_holder_name || ""}
                    onChange={(e) =>
                      updateField(index, "account_holder_name", e.target.value)
                    }
                  />
                </div>

                <div className="fr-row fr-two-col">
                  <div>
                    <label className="fr-label">Account Number</label>
                    <input
                      className="fr-input"
                      placeholder="1234567890"
                      value={method.account_number || ""}
                      onChange={(e) =>
                        updateField(index, "account_number", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="fr-label">IFSC Code</label>
                    <input
                      className="fr-input"
                      placeholder="SBIN0001234"
                      value={method.ifsc_code || ""}
                      onChange={(e) =>
                        updateField(index, "ifsc_code", e.target.value)
                      }
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        ))}

        <button
          type="button"
          className="fr-btn fr-btn-secondary add-btn"
          onClick={addMethod}
        >
          + Add Payment Method
        </button>

        <div className="fr-actions">
          <button type="submit" className="fr-btn fr-btn-primary">
            Save All
          </button>
        </div>
      </form>
    </div>
  );
}
