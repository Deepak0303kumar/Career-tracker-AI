// 1. Initialize Supabase 
const SUPABASE_URL = 'https://mkhegaeevzopltoqovcb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1raGVnYWVldnpvcGx0b3FvdmNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NzM4MzUsImV4cCI6MjA5NjM0OTgzNX0.pX-Ih3lXa0L4i4vK8UCRQPZ7gYlaCVnxyOEDEiGou7k';

window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Gateway UI & Auth Logic
(function () {
  const form = document.getElementById("auth-form");
  const statusMsg = document.getElementById("status-msg");
  const submitBtn = document.getElementById("submit-btn");
  const submitLabel = document.getElementById("submit-label");
  const submitSpinner = document.getElementById("submit-spinner");
  const modeToggleLink = document.getElementById("mode-toggle-link");
  const formTitle = document.getElementById("form-title");
  const formSubtext = document.getElementById("form-subtext");
  const switchPrompt = document.getElementById("switch-prompt");
  const googleBtn = document.getElementById("google-btn");

  let mode = "signin"; // Starts in login mode

  function setStatus(message, type) {
    statusMsg.textContent = message || "";
    // Updates color based on success or error
    statusMsg.style.color = type === "error" ? "#ef4444" : "#22c55e"; 
  }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitSpinner.classList.toggle("hidden", !isLoading);
  }

  // Toggles text between Sign In and Sign Up
  function applyMode() {
    if (mode === "signin") {
      formTitle.textContent = "The Gateway";
      formSubtext.textContent = "Sign in to access your executive suite or join the elite.";
      submitLabel.textContent = "Sign In";
      switchPrompt.textContent = "Don't have an account? ";
      modeToggleLink.textContent = "Sign Up";
    } else {
      formTitle.textContent = "Join the Elite";
      formSubtext.textContent = "Create your executive account to begin.";
      submitLabel.textContent = "Create Account";
      switchPrompt.textContent = "Already have an account? ";
      modeToggleLink.textContent = "Sign In";
    }
    setStatus("");
  }

  modeToggleLink.addEventListener("click", (e) => {
    e.preventDefault();
    mode = mode === "signin" ? "signup" : "signin";
    applyMode();
  });

  // Handle Email/Password Submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    setStatus("");
    setLoading(true);

    try {
      if (mode === "signin") {
        const { error } = await window.supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setStatus("Logged in successfully! Redirecting...", "success");
        // window.location.href = "../dashboard.html"; // Uncomment when dashboard is ready
      } else {
        const { error } = await window.supabaseClient.auth.signUp({ email, password });
        if (error) throw error;
        setStatus("Account created. Check your inbox to confirm your email.", "success");
      }
    } catch (err) {
      setStatus(err.message || "Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  });

  // Handle Google OAuth
  googleBtn.addEventListener("click", async () => {
    setStatus("Redirecting to Google...", "success");
    
    const { error } = await window.supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/dashboard.html" },
    });

    if (error) {
      setStatus(`Error: ${error.message}`, "error");
      console.error("OAuth Error:", error);
    }
  });
})();