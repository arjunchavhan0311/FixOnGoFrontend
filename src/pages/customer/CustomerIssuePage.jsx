import { Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { bookService } from "../../services/customer-bookservices";
import { getCustomerByEmail } from "../../services/customer-service";

export default function CustomerIssuePage() {
  const locationState = useLocation();
  const navigate = useNavigate();

  const { serviceId, workerId } = locationState.state || {};

  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [contact, setContact] = useState("");
  const [location, setLocationAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // New fields for customer issue
  const [customerData, setCustomerData] = useState(null);
  const [useAnotherAddress, setUseAnotherAddress] = useState(false);

  const [newAddress, setNewAddress] = useState({
    contact: "",
    street: "",
    city: "",
    district: "",
    state: "",
    pincode: ""
  });

  useEffect(() => {

    const storedUser = localStorage.getItem("fixongo_auth");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) return;

    getCustomerByEmail(user.email).then((data) => {
      setCustomerData(data);
      setContact(data.customer_phoneno);
      setLocationAddress(
        `${data.street_address}, ${data.city},${data.district}, ${data.state} ${data.pincode}`
      );
    });

  }, []);

  const finalContact = useAnotherAddress
    ? newAddress.contact
    : contact;

  const finalAddress = useAnotherAddress
    ? `${newAddress.street}, ${newAddress.city}, ${newAddress.district}, ${newAddress.state} - ${newAddress.pincode}`
    : location;



  /* -------------------- IMAGE HANDLER -------------------- */
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* -------------------- VALIDATION -------------------- */
  const isFormValid =
    description.trim() &&
    visitDate &&
    visitTime &&
    (useAnotherAddress
      ? newAddress.contact && newAddress.street
      : contact && location);
  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async () => {
    if (!serviceId || !workerId) {
      alert("Invalid booking flow. Please select service again.");
      navigate("/service");
      return;
    }

    try {
      setLoading(true);

      const storedUser = localStorage.getItem("fixongo_auth");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!user) {
        alert("Please login first");
        return;
      }

      const serviceHistory = {
        customer_available_phoneno: finalContact,
        customer_Issues: description,
        service_location: finalAddress,
        available_date: visitDate,
        available_time: visitTime,

        booking_date: new Date().toISOString().split("T")[0],
        booking_time: new Date().toTimeString().split(" ")[0],

        paymentStatus: "PENDING",
        serviceStatus: "REGISTERED",
        paymentType: "CASH",

        customerId: user.id,
        workerId: workerId,
        serviceId: serviceId
      };

      const formData = new FormData();

      formData.append(
        "serviceHistoryDao",
        new Blob([JSON.stringify(serviceHistory)], {
          type: "application/json",
        })
      );

      // Backend supports single image
      if (images.length > 0) {
        formData.append("image", images[0].file);
      }

      await bookService(formData);

      alert("Booking Successful ✅");

      navigate("/");
    } catch (error) {
      console.error("BOOKING ERROR:", error.response?.data || error.message);
      alert("Booking Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border shadow-sm">
        <h2 className="text-3xl font-black mb-2">Describe Your Issue</h2>

        {/* DESCRIPTION */}
        <div className="mb-6">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Problem Description *
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 w-full rounded-xl border p-4 text-sm"
          />
        </div>

        {/* DATE & TIME */}
        <label className="text-xs font-bold text-slate-500 uppercase">
          Available Date & Time *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <input
            type="date"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            className="rounded-xl border p-3 text-sm"
          />
          <input
            type="time"
            value={visitTime}
            onChange={(e) => setVisitTime(e.target.value)}
            className="rounded-xl border p-3 text-sm"
          />
        </div>

        {/* SAVED CONTACT & ADDRESS */}

        {!useAnotherAddress && (

          <div className="bg-slate-50 border rounded-xl p-4 mb-4">

            <h3 className="text-sm font-bold mb-2">
              Saved Contact Information
            </h3>

            <input
              type="tel"
              value={contact}
              disabled
              className="w-full rounded-xl border p-3 text-sm mb-3"
            />

            <textarea
              rows={2}
              value={location}
              disabled
              className="w-full rounded-xl border p-3 text-sm"
            />

          </div>

        )}


        {/* new fields for customer issue */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={useAnotherAddress}
            onChange={() => setUseAnotherAddress(!useAnotherAddress)}
          />
          <label className="text-sm">
            Use Another Contact & Address
          </label>

        </div>

        {useAnotherAddress && (

          <div className="bg-slate-50 border rounded-xl p-4 mb-4">

            <h3 className="text-sm font-bold mb-2">
              Another Contact Information & Address
            </h3>

            <input
              type="tel"
              placeholder="Contact Number"
              onChange={(e) =>
                setNewAddress({ ...newAddress, contact: e.target.value })
              }
              className="w-full rounded-xl border p-3 text-sm mb-3" />

            <input
              placeholder="Street Address / Area House No."
              onChange={(e) =>
                setNewAddress({ ...newAddress, street: e.target.value })
              }
              className="w-full rounded-xl border p-3 text-sm mb-3" />
            <input
              placeholder="City"
              onChange={(e) =>
                setNewAddress({ ...newAddress, city: e.target.value })
              }
              className="w-full rounded-xl border p-3 text-sm mb-3" />
              
            <input
              placeholder="District"
              onChange={(e) =>
                setNewAddress({ ...newAddress, district: e.target.value })
              }
              className="w-full rounded-xl border p-3 text-sm mb-3" />

            <input
              placeholder="State"
              onChange={(e) =>
                setNewAddress({ ...newAddress, state: e.target.value })
              }
              className="w-full rounded-xl border p-3 text-sm mb-3" />

            <input
              placeholder="Pin Code"
              onChange={(e) =>
                setNewAddress({ ...newAddress, pincode: e.target.value })
              }
              className="w-full rounded-xl border p-3 text-sm mb-3" />
          </div>

        )}

        {/* IMAGE */}
        <div className="mb-6">
          <label className="text-xs font-bold uppercase">
            Upload Evidence (optional)
          </label>

          <label className="mt-3 flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer">
            <Upload size={22} />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />
          </label>

          {images.length > 0 && (
            <div className="mt-4 relative">
              <img
                src={images[0].preview}
                alt="preview"
                className="h-40 w-full object-cover rounded-xl"
              />
              <button
                onClick={() => removeImage(0)}
                className="absolute top-1 right-1 bg-black text-white p-1 rounded-full"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* SUBMIT */}
        <button
          disabled={!isFormValid || loading}
          onClick={handleSubmit}
          className="w-full bg-slate-900 text-white py-4 rounded-xl"
        >
          {loading ? "Processing..." : "Continue Booking"}
        </button>
      </div>
    </div>
  );
}
