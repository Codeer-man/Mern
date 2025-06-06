import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState("");
  const [Services, setGetServices] = useState({});
  const authorizeToken = `Bearer ${token}`;
  const [isLoading, setIsLoading] = useState(false);

  const storetokenInLs = (serverToken) => {
    localStorage.setItem("token", serverToken);
    setToken(serverToken);
  };

  // tackling the logout function
  const LogoutUser = () => {
    setToken("");
    setUser("");
    return localStorage.removeItem("token");
  };

  let isloggedIn = !!token;

  // JWT authencation - to get currently logged  user data

  const UserAuthencatoin = async () => {
    try {
      setIsLoading(true);
      const respomse = await fetch("http://localhost:3000/api/auth/user", {
        method: "GET",
        headers: {
          Authorization: authorizeToken,
          "Content-Type": "application/json",
        },
      });
      if (respomse.ok) {
        const data = await respomse.json();
        setUser(data.userdata);
        console.log(data.userdata);
        setIsLoading(false);
      } else {
        console.error("error in the link");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("something wrong", error);
    }
  };

  // fetch servics data from db
  const getServices = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/services/find", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGetServices(data.data);
        console.log(data.data);
      }
    } catch (error) {
      console.error("Frontend error", error);
    }
  };

  useEffect(() => {
    if (token) {
      UserAuthencatoin();
    }
  }, [token]);

  useEffect(() => {
    getServices();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isloggedIn,
        storetokenInLs,
        LogoutUser,
        user,
        Services,
        authorizeToken,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authcontextvalue = useContext(AuthContext);

  if (!authcontextvalue) {
    throw new Error("useAuth used outside of the Provider");
  }
  return authcontextvalue;
};
