async function login() {
  const button = document.getElementById("sbmtbtn");

  if (!button) {
    console.error("Submit button not found!");
    return;
  }

  button.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:5000/api/author/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const err = await response.json();
        alert(err.message || "Login failed");
        return;
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.access_token);
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login.");
    }
  });
}
