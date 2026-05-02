import { useRef, useState } from "react";
import {
  RiAccountCircleLine,
  RiArrowRightLine,
  RiBuilding4Line,
  RiCheckboxCircleFill,
  RiDeleteBin6Line,
  RiEyeLine,
  RiEyeOffLine,
  RiMapPinLine,
  RiStarFill,
  RiUploadCloud2Line
} from "react-icons/ri";
import { Link } from "react-router-dom";

import { SERVICE_CATEGORIES } from "../constants/serviceCategories";
import { signUp } from "../services/worker-service";

function WorkerRegistration({ isModal = false }) {

  const [formData, setFormData] = useState({
    worker_name: "",
    worker_gender: "",
    worker_age: "",
    street_address: "",
    state:"",
    district:"",
    city:"",
    pincode:"",
    email: "",
    password: "",
    worker_phoneno: "",
    worker_AadharNo: "",
    worker_PanNo: "",

    serviceCategory: "",
    worker_experience: "",
    worker_bio: "",
    worker_languages: "",
    worker_certificates: "",
    worker_education: "",
    worker_fees: ""
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [previews, setPreviews] = useState({ adhar: null, pan: null });

  const adharInputRef = useRef(null);
  const panInputRef = useRef(null);
  const [aadharFile, setAadharFile] = useState(null);
  const [panFile, setPanFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        name === "worker_age" || name === "worker_experience"
          ? Number(value)
          : name === "worker_PanNo"
            ? value.toUpperCase().trim()
            : value.trim()
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "adhar") {
      setAadharFile(file);
    } else {
      setPanFile(file);
    }

    setPreviews(prev => ({
      ...prev,
      [type]: URL.createObjectURL(file)
    }));
  };

  const removeImage = (type) => {
    setPreviews(prev => ({ ...prev, [type]: null }));
    setFormData(prev => ({
      ...prev,
      [type === "adhar" ? "worker_Aadhar_img" : "worker_Pan_img"]: ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const data = new FormData();
    data.append(
      "data",
      new Blob([JSON.stringify(formData)], { type: "application/json" })
    );
    data.append("aadharImg", aadharFile);
    data.append("panImg", panFile);

    try {
      await signUp(data);
      alert("🎉 Registration successful! Wait for admin approval.");
    } catch {
      alert("Signup failed");
    }
  };

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const inputClass = "w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 px-12 text-sm font-bold outline-none transition-all duration-300 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10";

  const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-300 z-10 pointer-events-none";

  return (
    <div className={`${isModal
        ? "flex items-center justify-center"
        : "min-h-screen bg-slate-100 flex items-center justify-center px-6 py-16"
      }`}>

      <div className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl grid lg:grid-cols-12 overflow-hidden">

        {/* LEFT FORM */}
        <div className="lg:col-span-7 px-10 py-12">

          {/* PERSONAL DETAILS */}
          <div className="mb-10">
            <h3 className="flex items-center gap-3 text-sm font-black tracking-widest text-blue-600 mb-6 uppercase">
              <RiAccountCircleLine size={22} /> Personal Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              
              <input className="input-soft" placeholder="Full Name"
                name="worker_name" onChange={handleChange} />
             
              <input className="input-soft" placeholder="Email ID"
                name="email" onChange={handleChange} />
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <select className="input-soft" name="worker_gender" onChange={handleChange}>
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

              
              <input className="input-soft" placeholder="Age"
                name="worker_age" type="number" onChange={handleChange} />
              
              <input className="input-soft" placeholder="Phone Number"
                name="worker_phoneno" onChange={handleChange} />
            </div>
     
          <div className="relative group md:col-span-1  gap-4 mt-4"><RiMapPinLine className={iconClass} size={20} />
          <input name="street_address" placeholder="Office Street Address / Area Office No." className={inputClass} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
          
          <input name="state" placeholder="State" className={inputClass} onChange={handleChange} />

         <input name="district" placeholder="District" className={inputClass} onChange={handleChange} />

         <input name="city" placeholder="City" className={inputClass} onChange={handleChange} />

        <input name="pincode" placeholder="Pin Code" className={inputClass} onChange={handleChange} />
          </div>
          </div>
          {/* DOCUMENTS */}
          <div className="mb-10">
            <h3 className="flex items-center gap-3 text-sm font-black tracking-widest text-blue-600 mb-6 uppercase">
              <RiBuilding4Line size={22} /> Verification Documents
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <input className="input-soft" placeholder="Aadhar Number"
                name="worker_AadharNo" onChange={handleChange} />
              <input className="input-soft" placeholder="PAN Card Number"
                name="worker_PanNo" onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              {[{ id: "adhar", ref: adharInputRef }, { id: "pan", ref: panInputRef }].map(doc => (
                <div key={doc.id}>
                  <input hidden ref={doc.ref} type="file" accept="image/*"
                    onChange={(e) => handleFileChange(e, doc.id)} />

                  {!previews[doc.id] ? (
                    <button type="button"
                      onClick={() => doc.ref.current.click()}
                      className="upload-dashed">
                      <RiUploadCloud2Line size={28} />
                      <span>Upload {doc.id.toUpperCase()} Card</span>
                    </button>
                  ) : (
                    <div className="relative h-28 rounded-xl overflow-hidden border">
                      <img src={previews[doc.id]} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(doc.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full">
                        <RiDeleteBin6Line />
                      </button>
                      <RiCheckboxCircleFill className="absolute bottom-2 right-2 text-blue-600 text-xl" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* PROFESSIONAL DETAILS */}
          <div className="mb-10">
            <h3 className="text-sm font-black tracking-widest text-blue-600 mb-6 uppercase flex items-center gap-2">
              🧑‍🔧 Professional Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* ATTRACTIVE SERVICE CATEGORY */}
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                </span>

                <select
                  className="input-soft pl-10 appearance-none cursor-pointer"
                  name="serviceCategory"
                  value={formData.serviceCategory}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select Service Category
                  </option>
                  {SERVICE_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  ▼
                </span>
              </div>

              <input
                className="input-soft"
                placeholder="Experience (Years)"
                name="worker_experience"
                type="number"
                min="0"
                onChange={handleChange}
              />
            </div>

            <textarea
              className="input-soft mt-4 resize-none"
              rows="3"
              placeholder="Short Bio / About You"
              name="worker_bio"
              onChange={handleChange}
            />

            <input
              className="input-soft mt-4"
              placeholder="Languages (Hindi, English...)"
              name="worker_languages"
              onChange={handleChange}
            />

            <input
              className="input-soft mt-4"
              placeholder="Certificates / Licenses"
              name="worker_certificates"
              onChange={handleChange}
            />

            <div className="grid grid-cols-2 gap-4 mt-4">
              <input
                className="input-soft"
                placeholder="Education"
                name="worker_education"
                onChange={handleChange}
              />

              <input
                className="input-soft"
                placeholder="Fees (₹)"
                name="worker_fees"
                type="number"
                min="100"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="relative">
              <input
                className="input-soft pr-12"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={handleChange}
              />
              <button type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2">
                {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>

            <div className="relative">
              <input
                className="input-soft pr-12"
                placeholder="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2">
                {showConfirmPassword ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-black tracking-[0.2em] flex items-center justify-center gap-3">
            COMPLETE REGISTRATION <RiArrowRightLine />
          </button>

          <p className="text-center text-sm mt-6 text-slate-500">
            Already registered?{" "}
            <Link to="/workerlogin" className="text-blue-600 font-bold">
              Login here
            </Link>
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-950 to-slate-900 text-white p-12 flex-col justify-between">
          <div>
            <h2 className="text-4xl font-black">
              Ready to grow your <span className="text-blue-500">Business?</span>
            </h2>
            <h1> Become a FixOnGo Service Provider</h1>
            <ul className="mt-10 space-y-6 text-sm font-bold uppercase">
              <li>✔ Smart Lead Matching</li>
              <li>✔ Daily Payouts</li>
              <li>✔ 24/7 Support</li>
              <li>✔ Grow Professionally</li>
              <li>✔ No Commission Fees</li>
              <li>✔  Work locally</li>
              <li>✔ Get verified customers</li>
              <li>✔ Flexible working hours</li>
              <li>✔ Professional support team</li>
              <li>✔ Earn more</li>
            </ul>

            <section className="mt-10 space-y-6 text-sm font-bold">
              <h2>Simple & Secure Verification</h2>
              <p className="mt-10 space-y-6 text-sm font-bold">
                To maintain trust and quality, we verify all service providers before
                approval.
              </p>

              <div className="mt-10 space-y-6 text-sm font-bold uppercase">
                <div>1️⃣ Submit basic details</div>
                <div>2️⃣ Documents verification</div>
                <div>3️⃣ Admin approval</div>
                <div>4️⃣ Start receiving jobs</div>
              </div>
            </section>
          </div>

          <div className="bg-slate-800 p-6 rounded-2xl">
            <div className="flex gap-1 text-yellow-400 mb-3">
              {[...Array(5)].map((_, i) => <RiStarFill key={i} />)}
            </div>
            <p className="italic text-sm mb-4">
              “FixOnGo changed my life. I get jobs every day.”
            </p>
            <p className="font-black uppercase text-sm">
              Rajesh Kumar <span className="text-blue-500 ml-2">Gold Partner</span>
            </p>
          </div>
        </div>

      </div>

      {/* STYLES */}
      <style>{`
        .input-soft {
          width: 100%;
          padding: 0.9rem 1.1rem;
          border-radius: 0.9rem;
          background: #f8fafc;
          font-weight: 600;
          outline: none;
          transition: all 0.25s ease;
          border: 1px solid transparent;
        }
        .input-soft:hover {
          background: #f1f5f9;
        }
        .input-soft:focus {
          box-shadow: 0 0 0 2px #2563eb;
          background: #fff;
          border-color: #2563eb;
        }
        .upload-dashed {
          width: 100%;
          height: 7rem;
          border-radius: 1rem;
          border: 2px dashed #cbd5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.7rem;
          font-weight: 800;
          color: #64748b;
          background: #f8fafc;
        }
      `}</style>

    </div>
  );
}

export default WorkerRegistration;
