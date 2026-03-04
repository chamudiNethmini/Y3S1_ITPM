const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  navigate("/");
};

<button onClick={handleLogout}>
   Logout
</button>