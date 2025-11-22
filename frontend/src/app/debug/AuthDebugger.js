// Add this temporarily to your guide profile page
function AuthDebugger() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    console.log("🔐 Token exists:", !!token);
    console.log("👤 User data:", userData);

    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="bg-yellow-100 border border-yellow-400 p-4 rounded mb-4">
      <h3 className="font-bold">Auth Debug Info:</h3>
      <p>Token: {localStorage.getItem("token") ? "✅ Exists" : "❌ Missing"}</p>
      <p>
        User: {user ? `✅ ${user.name} (${user.role})` : "❌ Not logged in"}
      </p>
    </div>
  );
}

export default AuthDebugger;
