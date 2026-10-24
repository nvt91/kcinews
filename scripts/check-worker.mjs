const url = "https://kcinews.golffashion-vn.workers.dev/api/vbee-callback";

try {
  const response = await fetch(url, {
    method: "GET",
    redirect: "error",
    signal: AbortSignal.timeout(15000),
  });
  if (response.status !== 200) {
    throw new Error("Worker health check returned HTTP " + response.status);
  }
  const data = await response.json();
  if (data?.status !== "ready" || typeof data?.service !== "string") {
    throw new Error("Worker response does not match expected KCI callback health schema");
  }
  console.log("KCI Cloudflare Worker endpoint responds 200 with ready status.");
} catch (error) {
  console.error("KCI Cloudflare Worker health check failed:", error.message);
  process.exitCode = 1;
}
