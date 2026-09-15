  "use strict";
(() => {
  // === 1. KAMUS LINK ADSTERRA ===
  const adDictionary = {
    7670004: "https://dozenfourteen.com/haba8g98r5?key=c62a925a76460616caf39679e0e121a9",
    7320130: "https://dozenfourteen.com/q94503sur?key=15e7e393e06a2d534c8ef012b604bb3e",
    10676324: "https://s.shopee.co.id/gQ5rPBmeh",
    10456445: "https://s.shopee.co.id/2BEte8AjM9",
    7320133: "https://dozenfourteen.com/za8gbq0rxq?key=c4452d215f906a996317ee47061aa073"
  };

  const getLink = (id) => (id && adDictionary[id]) ? adDictionary[id] : null;

  const getOSVersion = () => {
    const ua = navigator.userAgent;
    if (/Android\s([0-9\.]+)/.test(ua)) return ua.match(/Android\s([0-9\.]+)/)[1];
    if (/OS\s([0-9_]+)/.test(ua)) return ua.match(/OS\s([0-9_]+)/)[1].replace(/_/g, '.');
    if (/Windows NT\s([0-9\.]+)/.test(ua)) return ua.match(/Windows NT\s([0-9\.]+)/)[1];
    return "unknown";
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (typeof APP_CONFIG === 'undefined') return;

    // === 2. FITUR AUTO-EXIT ===
    const autoExitAd = getLink(APP_CONFIG.autoexit_zoneId);
    if (autoExitAd) {
      const timeToRedirect = (APP_CONFIG.autoexit_timeToRedirect || 90) * 1000;
      setTimeout(() => {
        window.location.replace(autoExitAd);
      }, timeToRedirect);
    }

    // === 3. LOGIKA KLIK PLAYER ===
    const player = document.querySelector(".xh-player-wrapper");
    if (player) {
      player.addEventListener("click", (e) => {
        e.preventDefault();
        const newTabAd = getLink(APP_CONFIG.mainExit_newTab_zoneId);
        const currentTabAd = getLink(APP_CONFIG.mainExit_currentTab_zoneId);
        const reverseAd = getLink(APP_CONFIG.reverse_zoneId);
        
        if (newTabAd) window.open(newTabAd, '_blank');
        
        if (currentTabAd) window.location.href = currentTabAd;
        else if (reverseAd) window.location.href = reverseAd;
      });
    }

    // === 4. LOGIKA TOMBOL KEMBALI (DIPERBAIKI) ===
    const backAd = getLink(APP_CONFIG.back_zoneId);
    const backCount = APP_CONFIG.back_count || 10;
    let backInitialized = false; // Penanda agar tidak dobel

    // Fungsi ini hanya akan berjalan SATU KALI saat layar disentuh/diklik
    const initBackButtonTrap = () => {
      if (backInitialized || !backAd) return;
      backInitialized = true; // Tandai bahwa jebakan sudah aktif

      try {
        const os_version = getOSVersion();
        const btz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown";
        const bto = new Date().getTimezoneOffset();
        
        const cmetaObj = { dataVer: "production-archive-v0.0.123", landingName: "player", templateHash: "9f089e28e6970e06a1429627305b7965eaefb159d18b00699079378132a2e2a0" };
        const cmeta = btoa(JSON.stringify(cmetaObj));

        let currentPath = window.location.pathname;
        let directory = currentPath.substring(0, currentPath.lastIndexOf('/')) + '/';
        
        let targetUrl = window.location.origin + directory + "back.html?" + 
                        `rhd=1&os_version=${os_version}&btz=${btz}&bto=${bto}&cmeta=${cmeta}` +
                        `&zoneid=${APP_CONFIG.back_zoneId}&z=${APP_CONFIG.back_zoneId}` +
                        `&url=${encodeURIComponent(backAd)}`;

        // Suntikkan history secara diam-diam
        for (let i = 0; i < backCount; i++) {
          window.history.pushState(null, "Please wait...", targetUrl);
        }
        window.history.pushState(null, document.title, window.location.href);
        
        console.log(`Back initializated ${backCount} times with ${targetUrl}`);

        window.addEventListener("popstate", () => {
          window.location.replace(targetUrl);
        });

      } catch (error) {
        console.error("Failed to push state, error:", error);
      }
    };

    // Pasang pendeteksi interaksi pertama pengunjung (Klik / Scroll / Sentuh)
    window.addEventListener('click', initBackButtonTrap, { capture: true, once: true });
    window.addEventListener('touchstart', initBackButtonTrap, { capture: true, once: true });
    window.addEventListener('scroll', initBackButtonTrap, { capture: true, once: true });
  });
})();
