import API from "../../../api/api";
import { frontLogin } from "../../../utils/frontAuth";

const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    toast.error("Please fill in all fields");
    return;
  }

  setLoading(true);
  try {
    const result = await frontLogin(email, password, "OWNER");

    if (result.success) {
      toast.success("Login successful!");
      navigate("/owner-dashboard");
    } else {
      toast.error(result.message || "Login failed");
    }
  } catch (err) {
    toast.error("Login failed");
  } finally {
    setLoading(false);
  }
};
