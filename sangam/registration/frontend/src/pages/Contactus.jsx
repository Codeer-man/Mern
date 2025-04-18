import { useState, useEffect } from "react";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

export default function Contactus() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    message: "",
  });

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        message: "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/form/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Message sent successfully!");
        setFormData({ message: "" });
      } else {
        toast.error(data.message || "something went wrong");
      }
    } catch (error) {
      console.error(data.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-lg w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              value={formData.username}
              placeholder="Username"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={!!user}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Email"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={!!user}
            />
            <textarea
              name="message"
              value={formData.message}
              placeholder="Message"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              type="submit"
              className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none cursor-pointer"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
