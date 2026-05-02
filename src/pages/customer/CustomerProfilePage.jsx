import { Building, Home, Image, Mail, MapPin, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { getCustomerByEmail } from "../../services/customer-service";
import { myAxios } from "../../services/helper";

const CustomerProfilePage = () => {

  const authData = JSON.parse(localStorage.getItem("fixongo_auth"));
    const email = authData?.email;


  const [profile, setProfile] = useState({
    customer_name: "",
    customer_age: "",
    customer_gender: "",
    street_address: "",
    state: "",
    district: "",
    city: "",
    pincode: "",
    customer_phoneno: "",
    customer_office_address: "",
    customer_profile_img: ""
  });

  const [preview, setPreview] = useState("");

  // Load profile
  useEffect(() => {
    getCustomerByEmail(email)
      .then((data) => {
        setProfile(data);
        setPreview(data.customer_profile_img);
      })
      .catch((err) => console.log(err));
  }, [email]);

  // Handle input change
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  // Handle image upload
  const handleImage = (e) => {

    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onloadend = () => {

      setPreview(reader.result);

      setProfile({
        ...profile,
        customer_profile_img: reader.result
      });

    };

    reader.readAsDataURL(file);
  };

  // Update profile
  const updateProfile = () => {

    myAxios
      .put(`/customer/update/${email}`, profile)
      .then(() => {
        alert("Profile Updated Successfully");
      })
      .catch((err) => console.log(err));

  };

  return (

    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 text-center">

          <h2 className="text-2xl font-bold">Customer Profile</h2>
          <p className="text-sm opacity-80">Manage your personal details</p>

        </div>

        <div className="p-8">

          {/* Profile Image */}
          <div className="flex flex-col items-center mb-8">

            <img
              src={
                preview ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
            />

            <label className="mt-3 text-blue-600 text-sm flex items-center gap-2 cursor-pointer hover:text-blue-800">

              <Image size={16} />
              Change Photo

              <input
                type="file"
                className="hidden"
                onChange={handleImage}
              />

            </label>

          </div>

          {/* Form */}
          <div className="grid md:grid-cols-2 gap-5">

            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18}/>
              <input
                type="text"
                name="customer_name"
                value={profile.customer_name}
                onChange={handleChange}
                placeholder="Full Name"
                className="input pl-10"
              />
            </div>

            {/* Email (disabled) */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18}/>
              <input
                type="email"
                value={email}
                disabled
                className="input pl-10 bg-gray-100"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={18}/>
              <input
                type="text"
                name="customer_phoneno"
                value={profile.customer_phoneno}
                onChange={handleChange}
                placeholder="Phone Number"
                className="input pl-10"
              />
            </div>

            {/* Age */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18}/>
              <input
                type="number"
                name="customer_age"
                value={profile.customer_age}
                onChange={handleChange}
                placeholder="Age"
                className="input pl-10"
              />
            </div>

            {/* Gender */}
            <select
              name="customer_gender"
              value={profile.customer_gender}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            {/* Street */}
            <div className="relative">
              <Home className="absolute left-3 top-3 text-gray-400" size={18}/>
              <input
                type="text"
                name="street_address"
                value={profile.street_address}
                onChange={handleChange}
                placeholder="Street Address"
                className="input pl-10"
              />
            </div>

            {/* State */}
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={18}/>
              <input
                type="text"
                name="state"
                value={profile.state}
                onChange={handleChange}
                placeholder="State"
                className="input pl-10"
              />
            </div>

            {/* District */}
            <input
              type="text"
              name="district"
              value={profile.district}
              onChange={handleChange}
              placeholder="District"
              className="input"
            />

            {/* City */}
            <input
              type="text"
              name="city"
              value={profile.city}
              onChange={handleChange}
              placeholder="City"
              className="input"
            />

            {/* Pincode */}
            <input
              type="number"
              name="pincode"
              value={profile.pincode}
              onChange={handleChange}
              placeholder="Pin Code"
              className="input"
            />

          </div>

          {/* Office Address */}
          <div className="mt-5 relative">

            <Building className="absolute left-3 top-3 text-gray-400" size={18}/>

            <input
              type="text"
              name="customer_office_address"
              value={profile.customer_office_address}
              onChange={handleChange}
              placeholder="Office Address (Optional)"
              className="input pl-10"
            />

          </div>

          {/* Update Button */}
          <button
            onClick={updateProfile}
            className="mt-8 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Update Profile
          </button>

        </div>

      </div>

    </div>
  );
};

export default CustomerProfilePage;