import React, { useState } from "react";
import "./Freelancer.css";

export default function FreelancerPayment() {
  const [methods, setMethods] = useState([
    {
      type: "UPI",
      upiId: "",
      accountHolder: "",
      accountNumber: "",
      ifsc: "",
    },
  ]);

  const addMethod = () => {
    setMethods((prev) => [
      ...prev,
      {
        type: "UPI",
        upiId: "",
        accountHolder: "",
        accountNumber: "",
        ifsc: "",
      },
    ]);
  };

  const removeMethod = (index) => {
    setMethods((prev) => prev.filter((_, i) => i !== index));
  };

  const updateField = (index, field, value) => {
    setMethods((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  };

  const save = (e) => {
    e.preventDefault();
    console.log("Payment Methods:", methods);
    alert("Payment methods saved (UI only).");
  };

  return (
    <div className="fr-page">
      <form className="fr-card fr-form" onSubmit={save}>
        <h2 className="fr-title">Payment Methods</h2>

        {methods.map((method, index) => (
          <div key={index} className="fr-payment-block">
            <div className="fr-row fr-two-col">
              <div>
                <label className="fr-label">Payment Type</label>
                <select
                  className="fr-input"
                  value={method.type}
                  onChange={(e) => updateField(index, "type", e.target.value)}
                >
                  <option value="UPI">UPI</option>
                  <option value="Bank">Bank Transfer</option>
                </select>
              </div>

              <button
                type="button"
                className="fr-btn fr-btn-danger remove-btn"
                onClick={() => removeMethod(index)}
              >
                Remove
              </button>
            </div>

            {method.type === "UPI" && (
              <div className="fr-row">
                <label className="fr-label">UPI ID</label>
                <input
                  className="fr-input"
                  placeholder="yourname@upi"
                  value={method.upiId}
                  onChange={(e) =>
                    updateField(index, "upiId", e.target.value)
                  }
                />
              </div>
            )}

            {method.type === "Bank" && (
              <>
                <div className="fr-row">
                  <label className="fr-label">Account Holder Name</label>
                  <input
                    className="fr-input"
                    placeholder="Full name"
                    value={method.accountHolder}
                    onChange={(e) =>
                      updateField(index, "accountHolder", e.target.value)
                    }
                  />
                </div>

                <div className="fr-row fr-two-col">
                  <div>
                    <label className="fr-label">Account Number</label>
                    <input
                      className="fr-input"
                      placeholder="1234 5678 9012"
                      value={method.accountNumber}
                      onChange={(e) =>
                        updateField(index, "accountNumber", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="fr-label">IFSC Code</label>
                    <input
                      className="fr-input"
                      placeholder="SBIN0001234"
                      value={method.ifsc}
                      onChange={(e) => updateField(index, "ifsc", e.target.value)}
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
            Save
          </button>

          <button type="button" className="fr-btn" onClick={() => setMethods([])}>
            Clear All
          </button>
        </div>
      </form>
    </div>
  );
}
