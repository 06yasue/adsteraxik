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

  // Fungsi pintar untuk mendeteksi versi OS pengunjung
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
    // Mengarahkan pengguna secara otomatis setelah diam beberapa waktu
    const autoExitAd = getLink(APP_CONFIG.autoexit_zoneId);
    if (autoExitAd) {
      const timeToRedirect = (APP_CONFIG.autoexit_timeToRedirect || 90) * 1000;
      setTimeout(() => {
        window.location.replace(autoExitAd);
      }, timeToRedirect);
    }

    // === 3. LOGIKA KLIK PLAYER (MAIN & REVERSE) ===
    const player = document.querySelector(".xh-player-wrapper");
    if (player) {
      player.addEventListener("click", (e) => {
        e.preventDefault();
        const newTabAd = getLink(APP_CONFIG.mainExit_newTab_zoneId);
        const currentTabAd = getLink(APP_CONFIG.mainExit_currentTab_zoneId);
        const reverseAd = getLink(APP_CONFIG.reverse_zoneId);
        
        if (newTabAd) window.open(newTabAd, '_blank');
        
        // Prioritaskan current tab, jika kosong gunakan reverse sebagai cadangan
        if (currentTabAd) window.location.href = currentTabAd;
        else if (reverseAd) window.location.href = reverseAd;
      });
    }

    // === 4. LOGIKA TOMBOL KEMBALI (MIRIP MONETAG 100%) ===
    const backAd = getLink(APP_CONFIG.back_zoneId);
    const backCount = APP_CONFIG.back_count || 10; // Sekarang 10 kali jebakan sesuai permintaanmu

    if (backAd) {
      try {
        // Tarik data perangkat
        const os_version = getOSVersion();
        const btz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown";
        const bto = new Date().getTimezoneOffset();
        
        // Buat cmeta (metadata yang di-encode Base64) persis seperti Monetag
        const cmetaObj = { 
          dataVer: "production-archive-v0.0.123", 
          landingName: "player", 
          templateHash: "9f089e28e6970e06a1429627305b7965eaefb159d18b00699079378132a2e2a0" 
        };
        const cmeta = btoa(JSON.stringify(cmetaObj)); // Encode ke Base64

        // Merakit folder path
        let currentPath = window.location.pathname;
        let directory = currentPath.substring(0, currentPath.lastIndexOf('/')) + '/';
        
        // Merakit URL super panjang persis gaya Monetag, ditambah parameter url= untuk adsterra kita
        let targetUrl = window.location.origin + directory + "back.html?" + 
                        `rhd=1&os_version=${os_version}&btz=${btz}&bto=${bto}&cmeta=${cmeta}` +
                        `&zoneid=${APP_CONFIG.back_zoneId}&z=${APP_CONFIG.back_zoneId}` +
                        `&url=${encodeURIComponent(backAd)}`;

        // Eksekusi jebakan history
        for (let i = 0; i < backCount; i++) {
          window.history.pushState(null, "Please wait...", targetUrl);
        }
        
        window.history.pushState(null, document.title, window.location.href);
        
        // Log di console yang akan terlihat sangat meyakinkan!
        console.log(`Back initializated ${backCount} times with ${targetUrl}`);

        window.addEventListener("popstate", () => {
          window.location.replace(targetUrl);
        });

      } catch (error) {
        console.error("Failed to push state, error:", error);
      }
    }
  });
})();
