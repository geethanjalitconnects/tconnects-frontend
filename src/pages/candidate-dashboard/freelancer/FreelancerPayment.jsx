import React, { useState, useEffect } from "react";
import api from "../../../config/api";
import toast from "react-hot-toast";
import "./Freelancer.css";

export default function FreelancerPayment() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Empty template
  const newMethod = {
    payment_type: "UPI",
    upi_id: "",
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
  };

  // ======================================================
  // 1️⃣ LOAD PAYMENT METHODS FROM BACKEND
  // ======================================================
  useEffect(() => {
    const loadPayments = async () => {
      try {
        const res = await api.get(
          "/api/profiles/freelancer/payment-methods/"
        );
        setMethods(res.data);
      } catch (error) {
        toast.error("Unable to load payment methods.");
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  // ======================================================
  // 2️⃣ UPDATE A FIELD
  // ======================================================
  const updateField = (index, field, value) => {
    setMethods((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  };

  // ======================================================
  // 3️⃣ ADD NEW METHOD (POST)
  // ======================================================
  const addMethod = async () => {
    try {
      const res = await api.post(
        "/api/profiles/freelancer/payment-methods/",
        newMethod
      );
      setMethods((prev) => [...prev, res.data]);

      toast.success("Payment method added!");
    } catch (error) {
      toast.error("Failed to add payment method.");
    }
  };

  // ======================================================
  // 4️⃣ DELETE METHOD
  // ======================================================
  const removeMethod = async (id) => {
    try {
      await api.delete(
        `/api/profiles/freelancer/payment-methods/${id}/`
      );
      setMethods((prev) => prev.filter((m) => m.id !== id));
      toast.success("Payment method deleted.");
    } catch (error) {
      toast.error("Unable to delete payment method.");
    }
  };

  // ======================================================
  // 5️⃣ SAVE CHANGES (PATCH for each modified method)
  // ======================================================
  const save = async (e) => {
    e.preventDefault();

    try {
      for (const method of methods) {
        await api.patch(
          `/api/profiles/freelancer/payment-methods/${method.id}/`,
          method
        );
      }

      toast.success("Payment methods updated!");
    } catch (error) {
      toast.error("Update failed.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="fr-page">
      <form className="fr-card fr-form" onSubmit={save}>
        <h2 className="fr-title">Payment Methods</h2>

        {methods.map((method, index) => (
          <div key={method.id} className="fr-payment-block">
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
                onClick={() => removeMethod(method.id)}
              >
                Remove
              </button>
            </div>

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
                      placeholder="1234 5678 8901"
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
