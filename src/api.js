
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8001";

export async function createPurpose(formData) {
  const response = await fetch(`${API_BASE_URL}/api/purposes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error("Unable to publish your purpose. Please try again.");
  }

  return response.json();
}

export async function getPurposes() {
  const response = await fetch(`${API_BASE_URL}/api/purposes`);

  if (!response.ok) {
    throw new Error("Unable to load purposes. Please refresh the page.");
  }

  return response.json();
}