import { Star } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addFeedback } from "../../services/feedback-service";

export default function FeedbackPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { historyId, workerId, serviceId } = location.state || {};

     const storedUser = localStorage.getItem("fixongo_auth");
     const user = storedUser ? JSON.parse(storedUser) : null;

  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!description || rating === 0) {
      alert("Please give rating and description");
      return;
    }

    const feedbackData = {
      description,
      rating,
      historyId,
      customerId: user?.id,
      workerId,
      serviceId
    };

     console.log("Feedback Data:", feedbackData); // helpful for debugging
    try {
      setLoading(true);
      await addFeedback(feedbackData);
      alert("Feedback submitted successfully!");
      navigate("/customerhistory");
    } catch (error) {
      console.error(error);
      alert("Error submitting feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">

        <h2 className="text-2xl font-bold text-center mb-6">
          Give Feedback
        </h2>

        {/* Star Rating */}
        <div className="flex justify-center mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={40}
              className={`cursor-pointer transition ${(hover || rating) >= star
                  ? "text-yellow-400"
                  : "text-gray-300"
                }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              fill={(hover || rating) >= star ? "#facc15" : "none"}
            />
          ))}
        </div>

        {/* Description */}
        <textarea
          placeholder="Write your feedback..."
          className="w-full border rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>
    </div>
  );
}