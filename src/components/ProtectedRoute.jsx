import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import AppContext from "../AppContext";

const ProtectedRoute = ({ role }) => {
  const { token, user } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!token) {
      console.log("Not logged in. Redirecting to login page");
      navigate("/login", {
        state: { error: "You need to be logged in to access this page" },
      });
      return;
    }

    if (user.role !== role) {
      navigate("/login", {
        state: { error: "You are not authorized to access this page" },
      });
      return;
    }
    axios
      .get(`${process.env.REACT_APP_BACKEND_API}/api/user`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        //console.log(res.data);
        // set loading to false when successful

        setLoading(false);
      })
      .catch((err) => {
        //console.log(err);

        if (err.response.status === 403) {
          // redirect to login with wrong token
          navigate("/login", {
            state: { error: "You need to be logged in to access this page" },
          });
        }
      });
  }, []);

  // if loading, do not show anything
  if (loading) return null;
  // allow access to the page with correct token

  return <Outlet />;
};

export default ProtectedRoute;
