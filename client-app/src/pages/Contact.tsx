export default function Contact() {
  const email = "dunnnick2019@gmail.com"; // Replace with your email
  const subject = "Contact via Website";

  const handleEmailClick = () => {
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-6">Contact Me</h1>

      <p className="text-gray-300 mb-6 text-center max-w-xl">
        Want to get in touch? Click the button below to send me an email
        directly from your device. I’ll get back to you as soon as possible.
      </p>

      <h3 className="pb-4">dunnnick2019@gmail.com</h3>

      <button
        onClick={handleEmailClick}
        className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold text-white transition-colors duration-200"
      >
        Send Email
      </button>
    </div>
  );
}
