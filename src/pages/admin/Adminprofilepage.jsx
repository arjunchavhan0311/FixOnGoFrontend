import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Settings, Save } from "lucide-react";
import { profile, updateProfile } from "../../services/admin-service";

export default function AdminProfilePage({ setIsAdminProfileOpen }) {
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem("fixongo_auth"));
  const adminEmail = auth?.email;

  /* ================= DISPLAY STATE ================= */
  const [adminProfile, setAdminProfile] = useState({
    avatar: "/avatar.png",
    name: "",
    role: "ADMIN",
    joinDate: "2025"
  });

  /* ================= FORM STATE ================= */
  const [adminProfileForm, setAdminProfileForm] = useState({
    admin_name: "",
    admin_gender: "",
    admin_age: "",
    street_address: "",
    state: "",
    district: "",
    city: "",
    pincode: "",
    admin_phoneno: "",
    admin_profile_img: ""
  });


  /* ================= FETCH PROFILE ================= */
  useEffect(() => {

    if (!adminEmail) return;

    profile(adminEmail)
      .then((data) => {

        setAdminProfile({
          avatar:
            data.admin_profile_img ||
            `https://ui-avatars.com/api/?name=${data.admin_name}&background=4f46e5&color=fff`,
          name: data.admin_name,
          role: data.role,
          joinDate: "2025"
        });

        setAdminProfileForm({
          admin_name: data.admin_name || "",
          admin_gender: data.admin_gender || "",
          admin_age: data.admin_age || "",
          street_address: data.street_address || "",
          state: data.state || "",
          district: data.district || "",
          city: data.city || "",
          pincode: data.pincode || "",
          admin_phoneno: data.admin_phoneno || "",
          admin_profile_img: data.admin_profile_img || ""
        });

      })
      .catch((err) => {
        console.error(err);
        alert("❌ Failed to load profile");
      });

  }, [adminEmail]);

  /* ================= UPDATE PROFILE ================= */
  const handleUpdateAdminProfile = (e) => {

    e.preventDefault();

    updateProfile(adminEmail, adminProfileForm)
      .then(() => {
        alert("✅ Profile updated successfully");
        setIsAdminProfileOpen(false);
      })
      .catch((err) => {
        console.error(err);
        alert("❌ Update failed");
      });

  };

  return (

    <div className="animate-in max-w-4xl mx-auto">

      <button
        onClick={() => {
          navigate("/adminpage")
        }}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 font-semibold"
      >
        Back to Dashboard
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* ================= HEADER ================= */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">

          <div className="flex items-center gap-6">

            <div className="relative">
              <img
                src={adminProfile.avatar}
                className="w-24 h-24 rounded-full ring-4 ring-white/30"
                alt="Admin"
              />

              <button className="absolute bottom-0 right-0 bg-white text-indigo-600 p-2 rounded-full shadow-lg hover:bg-slate-100">
                <Camera size={16} />
              </button>
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-1">
                {adminProfile.name}
              </h1>

              <p className="text-indigo-100 font-semibold">
                {adminProfile.role}
              </p>

              <p className="text-indigo-200 text-sm mt-1">
                Member since {adminProfile.joinDate}
              </p>
            </div>

          </div>

        </div>

        {/* ================= FORM ================= */}
        <form onSubmit={handleUpdateAdminProfile} className="p-8">

          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Settings size={20} />
            Account Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <Input
              label="Full Name"
              value={adminProfileForm.admin_name}
              onChange={(e) =>
                setAdminProfileForm({
                  ...adminProfileForm,
                  admin_name: e.target.value
                })
              }
            />

            <Input
              label="Gender"
              value={adminProfileForm.admin_gender}
              onChange={(e) =>
                setAdminProfileForm({
                  ...adminProfileForm,
                  admin_gender: e.target.value
                })
              }
            />

            <Input
              label="Age"
              value={adminProfileForm.admin_age}
              onChange={(e) =>
                setAdminProfileForm({
                  ...adminProfileForm,
                  admin_age: e.target.value
                })
              }
            />

            <Input
              label="Street Address"
              value={adminProfileForm.street_address}
              onChange={(e) =>
                setAdminProfileForm({
                  ...adminProfileForm,
                  street_address: e.target.value
                })
              }
            />

            <Input
              label="City"
              value={adminProfileForm.city}
              onChange={(e) =>
                setAdminProfileForm({
                  ...adminProfileForm,
                  city: e.target.value
                })
              }
            />

            <Input
              label="District"
              value={adminProfileForm.district}
              onChange={(e) =>
                setAdminProfileForm({
                  ...adminProfileForm,
                  district: e.target.value
                })
              }
            />

            <Input
              label="State"
              value={adminProfileForm.state}
              onChange={(e) =>
                setAdminProfileForm({
                  ...adminProfileForm,
                  state: e.target.value
                })
              }
            />

            <Input
              label="Pincode"
              value={adminProfileForm.pincode}
              onChange={(e) =>
                setAdminProfileForm({
                  ...adminProfileForm,
                  pincode: e.target.value
                })
              }
            />

            <Input
              label="Phone Number"
              value={adminProfileForm.admin_phoneno}
              onChange={(e) =>
                setAdminProfileForm({
                  ...adminProfileForm,
                  admin_phoneno: e.target.value
                })
              }
            />

          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-slate-200">

            <button
              type="submit"
              className="flex-1 sm:flex-none bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => {
                navigate("/adminpage")
              }}
              className="flex-1 sm:flex-none bg-slate-100 text-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-slate-200"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}

/* ================= REUSABLE INPUT ================= */
const Input = ({ label, value, onChange }) => (

  <div>
    <label className="block text-slate-700 font-bold mb-2 text-sm">
      {label}
    </label>

    <input
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
      required
    />
  </div>

);