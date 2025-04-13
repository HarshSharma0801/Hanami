/**
 * HanamiTracker SDK
 * Version 2.0.0
 *
 * A robust tracking SDK for frontend analytics, supporting cross-origin requests,
 * subdomain cookie sharing, and HTTP/HTTPS environments.
 */
(function(window) {
  'use strict';

  // Ensure global namespace
  window.HanamiTracker = window.HanamiTracker || {};

  // Default configuration
  const config = {
    cookieName: 'hanami_tracking_session',
    trackedParams: ['tracking_code', 'utm_source', 'utm_medium', 'click_id'],
    cookieDays: 30, // Cookie expiration in days
    debug: false, // Debug mode (set via init options)
    maxTrackers: 10, // Limit trackers to prevent cookie size issues
    cookieDomain: null, // Default: current domain; set to '.vercel.app' for subdomains
  };

  // Utility functions
  const utils = {
    log: function(message, data) {
      if (config.debug && window.console) {
        console.log('HanamiTracker:', message, data || '');
      }
    },

    warn: function(message, data) {
      if (window.console) {
        console.warn('HanamiTracker:', message, data || '');
      }
    },

    error: function(message, data) {
      if (window.console) {
        console.error('HanamiTracker:', message, data || '');
      }
    },

    getCookie: function(name) {
      try {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) {
          const value = JSON.parse(decodeURIComponent(match[2]));
          utils.log('Cookie retrieved:', { name, value });
          return value;
        }
        return null;
      } catch (e) {
        utils.error('Error parsing cookie:', e);
        return null;
      }
    },

    setCookie: function(name, value, days) {
      try {
        const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
        const isHttps = window.location.protocol === 'https:';
        let cookieString = `${name}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires}; path=/`;

        // Set domain if specified (e.g., '.vercel.app' for subdomains)
        if (config.cookieDomain) {
          cookieString += `; domain=${config.cookieDomain}`;
        }

        // Apply Secure and SameSite attributes
        if (isHttps) {
          cookieString += '; Secure; SameSite=None';
        } else {
          // For HTTP (e.g., localhost), use SameSite=Lax to avoid browser rejection
          cookieString += '; SameSite=Lax';
          utils.warn('Non-HTTPS environment detected. Using SameSite=Lax and omitting Secure.');
        }

        document.cookie = cookieString;
        utils.log('Cookie set:', { name, value, isHttps, domain: config.cookieDomain });
      } catch (e) {
        utils.error('Failed to set cookie:', e);
      }
    },

    getURLParams: function() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const params = {};
        for (const param of config.trackedParams) {
          if (urlParams.has(param)) {
            params[param] = urlParams.get(param);
          }
        }
        utils.log('URL parameters:', params);
        return params;
      } catch (e) {
        utils.error('Error parsing URL parameters:', e);
        return {};
      }
    },

    sanitizeTracker: function(tracker) {
      // Ensure tracker fields are strings or null
      const sanitized = {};
      const fields = ['click_id', 'tracking_code', 'utm_source', 'utm_medium', 'timestamp'];
      for (const field of fields) {
        sanitized[field] = typeof tracker[field] === 'string' ? tracker[field] : null;
      }
      return sanitized;
    },
  };

  // Core SDK functionality
  const SDK = {
    init: function(options = {}) {
      // Merge options with defaults
      Object.assign(config, options);
      utils.log('SDK initialized with config:', config);

      // Validate cookieDomain
      if (config.cookieDomain && !config.cookieDomain.startsWith('.')) {
        utils.warn('cookieDomain should start with a dot (e.g., .vercel.app) for subdomain sharing.');
      }

      // Check for tracking parameters in URL
      const params = utils.getURLParams();
      let sessionData = utils.getCookie(config.cookieName) ?? { trackers: [] };

      if (params.click_id) {
        // Store click_id
        this.clickId = params.click_id;

        // Create new tracker
        const newTracker = utils.sanitizeTracker({
          click_id: params.click_id,
          tracking_code: params.tracking_code || null,
          utm_source: params.utm_source || null,
          utm_medium: params.utm_medium || null,
          timestamp: new Date().toISOString(),
        });

        // Check for duplicate click_id
        const existingTrackerIndex = sessionData.trackers.findIndex(
          (tracker) => tracker.click_id === params.click_id
        );
        if (existingTrackerIndex !== -1) {
          sessionData.trackers[existingTrackerIndex] = {
            ...sessionData.trackers[existingTrackerIndex],
            ...newTracker,
          };
          utils.log('Updated existing tracker:', newTracker);
        } else {
          sessionData.trackers.push(newTracker);
          utils.log('Added new tracker:', newTracker);
        }

        // Limit trackers
        if (sessionData.trackers.length > config.maxTrackers) {
          sessionData.trackers.shift();
          utils.log('Removed oldest tracker to maintain limit.');
        }

        // Set or update cookie
        utils.setCookie(config.cookieName, sessionData, config.cookieDays);

        // Trigger onTrack callback
        if (typeof config.onTrack === 'function') {
          try {
            config.onTrack(params);
          } catch (e) {
            utils.error('Error in onTrack callback:', e);
          }
        }
      } else {
        // Use existing session data
        if (sessionData?.trackers?.length > 0) {
          const latestTracker = sessionData.trackers[sessionData.trackers.length - 1];
          this.clickId = latestTracker.click_id;
          utils.log('Found existing tracker:', latestTracker);

          if (typeof config.onTrack === 'function') {
            try {
              config.onTrack(latestTracker);
            } catch (e) {
              utils.error('Error in onTrack callback:', e);
            }
          }
        }
      }

      return this;
    },

    getSessionData: function() {
      return utils.getCookie(config.cookieName);
    },

    getClickId: function() {
      return this.clickId || null;
    },

    getLastTracker: function() {
      const sessionData = this.getSessionData();
      if (sessionData?.trackers?.length > 0) {
        return sessionData.trackers[sessionData.trackers.length - 1];
      }
      return null;
    },

    getAllTrackers: function() {
      const sessionData = this.getSessionData();
      return sessionData?.trackers ?? [];
    },

    clearSession: function() {
      try {
        const expires = new Date(0).toUTCString();
        let cookieString = `${config.cookieName}=; expires=${expires}; path=/`;
        if (config.cookieDomain) {
          cookieString += `; domain=${config.cookieDomain}`;
        }
        document.cookie = cookieString;
        utils.log('Session cookie cleared.');
      } catch (e) {
        utils.error('Error clearing cookie:', e);
      }
    },
  };

  // Expose public API
  window.HanamiTracker = {
    init: SDK.init.bind(SDK),
    getClickId: SDK.getClickId.bind(SDK),
    getSessionData: SDK.getSessionData.bind(SDK),
    getLastTracker: SDK.getLastTracker.bind(SDK),
    getAllTrackers: SDK.getAllTrackers.bind(SDK),
    clearSession: SDK.clearSession.bind(SDK),
  };

  // Initialize with default options (debug enabled for development)
  // Users should call init explicitly with custom options
})(window);