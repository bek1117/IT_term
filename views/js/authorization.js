async function tryRefreshToken() {
  const refreshToken = cookieStore.get("refresh_token");
  if (!refreshToken) return false;

  try {
    const res = await fetch("http://localhost:5000/api/author/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return false;

    const { accessToken, refreshToken: newRefreshToken } = await res.json();

    localStorage.setItem("accessToken", accessToken);

    return true;
  } catch (err) {
    console.error("Token refresh failed", err);
    return false;
  }
}

async function authFetch(url, options = {}) {
  const token = localStorage.getItem("accessToken");

  options.headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  let response = await fetch(url, options);

  if (response.status === 401) {
    const refreshed = await tryRefreshToken();

    if (refreshed) {
      options.headers.Authorization = `Bearer ${localStorage.getItem(
        "accessToken"
      )}`;
      response = await fetch(url, options);
    } else {
      window.location.href = "/login";
    }
  }

  return response;
}
