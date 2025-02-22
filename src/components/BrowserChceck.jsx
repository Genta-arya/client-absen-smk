import React, { useEffect, useState } from "react";
import ErrorPage from "./ErrorPage";
import App from "../App";

const BrowserCheck = () => {
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Ambil informasi browser
    const userAgent = navigator.userAgent;
    const browserVersion = navigator.appVersion;
    console.log("User Agent:", userAgent);
    console.log("Browser Version:", browserVersion);

    // Cek apakah browser mendukung ES6+ dan fitur modern
    const isOldBrowser =
      !window.fetch || // Fetch API (ES6)
      !window.Promise || // Promise API
      !window.Symbol || // Symbol (ES6+)
      !window.WeakMap; // WeakMap (ES6+)

    if (isOldBrowser) {
      console.warn("🚨 Browser tidak didukung! Silakan update browser Anda.");
      setIsSupported(false);
    } else {
      console.log("✅ Browser mendukung ES6+ dan React.");
    }
  }, []);

  return isSupported ? <App /> : <ErrorPage />;
};

export default BrowserCheck;
