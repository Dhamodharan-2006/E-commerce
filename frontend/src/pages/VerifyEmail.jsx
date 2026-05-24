import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function VerifyEmail() {
  const { uidb64, token } = useParams();
  const [message, setMessage] = useState(
    "Verifying your email, please wait...",
  );
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/auth/verify/${uidb64}/${token}/`)
      .then((res) => {
        setMessage(res.data.message);
        setSuccess(true);
      })
      .catch((err) => {
        setMessage(
          "Verification failed. The link may have expired. Try signing up again.",
        );
      });
  }, [uidb64, token]);

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h2>{message}</h2>
      {success && (
        <a href="/login" style={{ color: "#4f46e5", fontSize: 16 }}>
          Click here to Login
        </a>
      )}
    </div>
  );
}

export default VerifyEmail;
