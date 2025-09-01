import { deleteCookie } from "cookies-next";

/**
 *
 * @param url
 * @param options
 * @returns
 * @deprecated
 */
// A wrapper for the native fetch function to handle token refreshing.
async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // First, try the request as is
  let response = await fetch(url, options);

  // If the response is 401, it might be due to an expired access token
  if (response.status === 401) {
    console.log("Access token expired. Attempting to refresh...");

    // Try to refresh the token
    const refreshResponse = await fetch("/api/auth/refresh", {
      method: "POST",
    });

    // If refreshing the token was successful, retry the original request
    if (refreshResponse.ok) {
      console.log("Token refreshed successfully. Retrying original request...");
      // The new access token is automatically set in the cookie by the refresh endpoint
      response = await fetch(url, options);
    } else {
      // If refreshing the token failed, the refresh token is also invalid.
      // Log the user out by redirecting to the login page.
      console.log("Failed to refresh token. Redirecting to login.");
      // Clear any remaining invalid cookies
      deleteCookie("accessToken");
      deleteCookie("refreshToken"); // This won't work for HttpOnly, but good practice
      window.location.href = "/login";
      // Return the failed refresh response to prevent further processing
      return refreshResponse;
    }
  }

  return response;
}

export default fetchWithAuth;
