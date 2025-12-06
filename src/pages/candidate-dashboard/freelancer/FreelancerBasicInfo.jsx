import React, { useState, useEffect } from "react";
import api from "../../../config/api";
import toast from "react-hot-toast";
import "./Freelancer.css";

export default function FreelancerBasicInfo() {
  const [form, setForm] = useState({
    full_name: "",
    phone_number: "",
    location: "",
    languages_known: "",
    is_published: false,   // ← NEW FIELD
  });

  const [preview, setPreview] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================================
  // 1️⃣ LOAD EXISTING FREELANCER DATA
  // ================================
  useEffect(() => {
    const fetchBasicInfo = async () => {
      try {
        const res = await api.get("/api/profiles/freelancer/basic/");
        const data = res.data;

        setForm({
          full_name: data.full_name || "",
          phone_number: data.phone_number || "",
          location: data.location || "",
          languages_known: data.languages_known || "",
          is_published: data.is_published || false, // ← ADD HERE
        });

        if (data.profile_picture) {
          setPreview(data.profile_picture);
        }
      } catch (error) {
        console.error("Error loading freelancer data:", error);
        toast.error("Unable to load basic information.");
      } finally {
        setLoading(false);
      }
    };

    fetchBasicInfo();
  }, []);

  // ================================
  // 2️⃣ HANDLE INPUT CHANGE
  // ================================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle publish toggle
  const togglePublish = () => {
    setForm({ ...form, is_published: !form.is_published });
  };

  // ================================
  // 3️⃣ FILE PREVIEW
  // ================================
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // ================================
  // 4️⃣ PATCH BASIC INFO + PUBLISH FLAG
  // ================================
  const updateBasicInfo = async () => {
    try {
      await api.patch("/api/profiles/freelancer/basic/", form);
      return true;
    } catch (error) {
      console.error("Error updating basic info:", error);
      return false;
    }
  };

  // ================================
  // 5️⃣ UPLOAD PROFILE PICTURE
  // ================================
  const uploadProfilePicture = async () => {
    if (!profilePicFile) return true;

    try {
      const formData = new FormData();
      formData.append("profile_picture", profilePicFile);

      await api.post("/api/profiles/freelancer/upload-picture/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return true;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      return false;
    }
  };

  // ================================
  // 6️⃣ SAVE ALL (PATCH + UPLOAD)
  // ================================
  const handleSave = async (e) => {
    e.preventDefault();

    const basicSuccess = await updateBasicInfo();
    const photoSuccess = await uploadProfilePicture();

    if (basicSuccess && photoSuccess) {
      toast.success("Your basic information has been updated!");
    } else {
      toast.error("Unable to update. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="fr-page">
      <form className="fr-card fr-form" onSubmit={handleSave}>
        <h2 className="fr-title">Basic Information</h2>

        {/* Full name */}
        <div className="fr-row">
          <label className="fr-label">Full name</label>
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            className="fr-input"
            required
          />
        </div>

        {/* Phone + Location */}
        <div className="fr-row fr-two-col">
          <div>
            <label className="fr-label">Phone number</label>
            <input
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              className="fr-input"
              required
            />
          </div>

          <div>
            <label className="fr-label">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="fr-input"
              required
            />
          </div>
        </div>

        {/* Languages */}
        <div className="fr-row">
          <label className="fr-label">Languages known</label>
          <input
            name="languages_known"
            value={form.languages_known}
            onChange={handleChange}
            className="fr-input"
          />
        </div>

        {/* Profile Picture */}
        <div className="fr-row">
          <label className="fr-label">Upload profile picture</label>

          <div className="fr-upload-row">
            <div className="fr-avatar-preview">
              {preview ? <img src={preview} alt="preview" /> : <div className="fr-avatar-placeholder">IMG</div>}
            </div>

            <input type="file" accept="image/*" onChange={handleFile} />
          </div>
        </div>

        {/* Publish Profile Toggle */}
        <div className="fr-row">
          <label className="fr-label">Profile Visibility</label>
          <button
            type="button"
            onClick={togglePublish}
            className={`fr-btn ${form.is_published ? "fr-btn-danger" : "fr-btn-secondary"}`}
          >
            {form.is_published ? "Unpublish Profile" : "Publish Profile"}
          </button>
        </div>

        {/* Buttons */}
        <div className="fr-actions">
          <button type="submit" className="fr-btn fr-btn-primary">
            Save
          </button>

          <button
            type="button"
            className="fr-btn"
            onClick={() => {
              setForm({
                full_name: "",
                phone_number: "",
                location: "",
                languages_known: "",
                is_published: false,
              });
              setPreview(null);
              setProfilePicFile(null);
            }}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
