/**
 * HanamiTracker SDK
 * Version 1.0.0
 * 
 * A lightweight tracking SDK that works with your backend tracking system.
 * It maintains the same cookie structure as your backend implementation.
 */
(function(window) {
    'use strict';

    // SDK Namespace
    window.HanamiTracker = window.HanamiTracker || {};

    // SDK Configuration
    const config = {
      cookieName: 'hanami_tracking_session',
      trackedParams: ['tracking_code', 'utm_source', 'utm_medium', 'click_id'],
      debug: true, // Enabled for logging
      cookieDays: 30 // Cookie expiration in days
    };

    // Utility functions
    const utils = {
      log: function(message, data) {
        if (config.debug && console) {
          console.log('HanamiTracker:', message, data || '');
        }
      },

      getCookie: function(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) {
          try {
            return JSON.parse(decodeURIComponent(match[2]));
          } catch (e) {
            utils.log('Error parsing cookie:', e);
            console.error('Cookie parse error:', e); // Added for visibility
            return null;
          }
        }
        return null;
      },

      setCookie: function(name, value, days) {
        try {
          const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
          const isHttps = window.location.protocol === 'https:';
          let cookieString = `${name}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires}; path=/`;

          if (isHttps) {
            // Add Secure and SameSite None for HTTPS
            cookieString += '; Secure; SameSite=None';
          }

          document.cookie = cookieString;
          utils.log('Cookie set:', { name, value, isHttps });
        } catch (e) {
          utils.log('Error setting cookie:', e);
          console.error('Failed to set cookie:', e); // Added for visibility
        }
      },

      getURLParams: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const params = {};

        for (const param of config.trackedParams) {
          if (urlParams.has(param)) {
            params[param] = urlParams.get(param);
          }
        }

        return params;
      }
    };

    // Core SDK functionality
    const SDK = {
      init: function(options = {}) {
        // Merge options with defaults
        Object.assign(config, options);

        utils.log('SDK initialized with options', config);

        // Check for tracking parameters in URL
        const params = utils.getURLParams();
        let sessionData = utils.getCookie(config.cookieName) ?? { trackers: [] };
        utils.log('SessionData', sessionData);

        if (params.click_id) {
          console.log("session data below");
          utils.log('bjbjb', sessionData);
          console.log("session data here", sessionData);

          // Store click_id for future reference
          this.clickId = params.click_id;

          // Create new tracker
          const newTracker = {
            click_id: params.click_id,
            tracking_code: params.tracking_code || null,
            utm_source: params.utm_source || null,
            utm_medium: params.utm_medium || null,
            timestamp: new Date().toISOString()
          };

          // Check for duplicate click_id and update if exists
          const existingTrackerIndex = sessionData.trackers.findIndex(
            tracker => tracker.click_id === params.click_id
          );
          if (existingTrackerIndex !== -1) {
            // Update existing tracker
            sessionData.trackers[existingTrackerIndex] = {
              ...sessionData.trackers[existingTrackerIndex],
              ...newTracker
            };
            utils.log('Updated existing tracker', newTracker);
          } else {
            // Add new tracker
            sessionData.trackers.push(newTracker);
            utils.log('Added new tracker', newTracker);
          }

          // Limit to 10 trackers to prevent cookie size issues
          if (sessionData.trackers.length > 10) {
            sessionData.trackers.shift();
            utils.log('Removed oldest tracker to maintain limit');
          }

          // Set or update cookie
          utils.setCookie(config.cookieName, sessionData, config.cookieDays);

          // Trigger onTrack callback if provided
          if (typeof config.onTrack === 'function') {
            config.onTrack(params);
          }
        } else {
          // Check for existing session cookie
          if (sessionData && sessionData.trackers && sessionData.trackers.length > 0) {
            // Use the most recent tracker
            const latestTracker = sessionData.trackers[sessionData.trackers.length - 1];
            this.clickId = latestTracker.click_id;

            utils.log('Found tracking data in cookie', latestTracker);

            // Trigger onTrack callback if provided
            if (typeof config.onTrack === 'function') {
              config.onTrack(latestTracker);
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
        if (sessionData && sessionData.trackers && sessionData.trackers.length > 0) {
          return sessionData.trackers[sessionData.trackers.length - 1];
        }
        return null;
      },

      getAllTrackers: function() {
        const sessionData = this.getSessionData();
        if (sessionData && sessionData.trackers) {
          return sessionData.trackers;
        }
        return [];
      }
    };

    // Expose public API
    window.HanamiTracker = {
      init: SDK.init.bind(SDK),
      getClickId: SDK.getClickId.bind(SDK),
      getSessionData: SDK.getSessionData.bind(SDK),
      getLastTracker: SDK.getLastTracker.bind(SDK),
      getAllTrackers: SDK.getAllTrackers.bind(SDK)
    };

    // Initialize the tracker explicitly
    window.HanamiTracker.init({ debug: true });
  })(window);