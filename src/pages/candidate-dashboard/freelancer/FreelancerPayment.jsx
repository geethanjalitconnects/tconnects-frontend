import React, { useState, useEffect } from "react";
import api from "../../../config/api";
import toast from "react-hot-toast";
import "./Freelancer.css";

export default function FreelancerPayment() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default new payment object
  const newMethod = {
    payment_type: "UPI",
    upi_id: "",
    account_holder_name: null,
    account_number: null,
    ifsc_code: null,
  };

  // ======================================================
  // 1️⃣ LOAD PAYMENT METHODS FROM BACKEND
  // ======================================================
  useEffect(() => {
    const loadPayments = async () => {
      try {
        const res = await api.get("/api/profiles/freelancer/payment-methods/");

        // safety: ensure array
        setMethods(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        toast.error("Unable to load payment methods.");
        setMethods([]); // prevent undefined
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  // ======================================================
  // 2️⃣ UPDATE A FIELD (local state)
  // ======================================================
  const updateField = (index, field, value) => {
    setMethods((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  };

  // ======================================================
  // 3️⃣ VALIDATION LOGIC (prevents 400 errors)
  // ======================================================
  const validatePayment = (method) => {
    if (method.payment_type === "UPI") {
      if (!method.upi_id || method.upi_id.trim() === "") {
        toast.error("Please enter a valid UPI ID.");
        return false;
      }
    }

    if (method.payment_type === "Bank") {
      if (
        !method.account_holder_name ||
        !method.account_number ||
        !method.ifsc_code
      ) {
        toast.error("Please fill all bank details.");
        return false;
      }
    }

    return true;
  };

  // ======================================================
  // 4️⃣ ADD NEW PAYMENT METHOD (POST)
  // ======================================================
  const addMethod = async () => {
    const payload = { ...newMethod };

    if (!validatePayment(payload)) return;

    try {
      const res = await api.post(
        "/api/profiles/freelancer/payment-methods/",
        payload
      );

      setMethods((prev) => [...prev, res.data]);

      toast.success("Payment method added!");
    } catch (error) {
      console.log(error);
      toast.error("Unable to add payment method.");
    }
  };

  // ======================================================
  // 5️⃣ DELETE PAYMENT METHOD
  // ======================================================
  const removeMethod = async (id) => {
    try {
      await api.delete(`/api/profiles/freelancer/payment-methods/${id}/`);
      setMethods((prev) => prev.filter((m) => m.id !== id));
      toast.success("Payment method deleted.");
    } catch (error) {
      toast.error("Unable to delete method.");
    }
  };

  // ======================================================
  // 6️⃣ SAVE ALL (PATCH PER ITEM)
  // ======================================================
  const save = async (e) => {
    e.preventDefault();

    try {
      for (const method of methods) {
        if (!validatePayment(method)) return;

        const payload = {
          payment_type: method.payment_type,
          upi_id: method.payment_type === "UPI" ? method.upi_id : null,
          account_holder_name:
            method.payment_type === "Bank"
              ? method.account_holder_name
              : null,
          account_number:
            method.payment_type === "Bank" ? method.account_number : null,
          ifsc_code:
            method.payment_type === "Bank" ? method.ifsc_code : null,
        };

        await api.patch(
          `/api/profiles/freelancer/payment-methods/${method.id}/`,
          payload
        );
      }

      toast.success("Payment methods updated!");
    } catch (error) {
      toast.error("Failed to update payment methods.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="fr-page">
      <form className="fr-card fr-form" onSubmit={save}>
        <h2 className="fr-title">Payment Methods</h2>

        {methods && methods.length > 0 ? (
          methods.map((method, index) => (
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
                        updateField(
                          index,
                          "account_holder_name",
                          e.target.value
                        )
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
                          updateField(
                            index,
                            "account_number",
                            e.target.value
                          )
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
                          updateField(
                            index,
                            "ifsc_code",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p className="fr-empty">No payment methods added yet.</p>
        )}

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
