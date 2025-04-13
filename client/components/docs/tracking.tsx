"use client";
import React, { useState } from "react";
import { FaCopy } from "react-icons/fa";

const TrackingSDKDocs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("nextjs");
  const [copied, setCopied] = useState<string>("");

  const copyToClipboard = (text: string, snippetId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(snippetId);
      setTimeout(() => setCopied(""), 2000);
    });
  };

  const nextjsSnippet = `
// In pages/_document.js or pages/_document.tsx

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Hanami Tracking SDK */}
        <script dangerouslySetInnerHTML={{
          __html: \`
            (function() {
              // Create script element
              const script = document.createElement('script');
              script.async = true;
              script.src = 'https://hanami-six.vercel.app/hanami-tracker.js';
              script.setAttribute('data-auto-init', 'true');
              
              // Insert script into document
              const firstScript = document.getElementsByTagName('script')[0];
              firstScript.parentNode.insertBefore(script, firstScript);
            })();
          \`
        }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
`;

  const reactSnippet = `
// In public/index.html

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>React App</title>
    
    <!-- Hanami Tracking SDK -->
    <script>
      (function() {
        // Create script element
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://hanami-six.vercel.app/hanami-tracker.js';
        script.setAttribute('data-auto-init', 'true');
        
        // Insert script into document
        const firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(script, firstScript);
      })();
    </script>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
`;

  const appComponentSnippet = `
// Alternative approach: In App.js or App.tsx component

import React, { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    // Load Hanami Tracking SDK
    const script = document.createElement('script');
    script.src = 'https://hanami-six.vercel.app/hanami-tracker.js';
    script.setAttribute('data-auto-init', 'true');
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Clean up script when component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="App">
      {/* Your app content */}
    </div>
  );
}

export default App;
`;

  const usageSnippet = `
// Using the Hanami Tracker in your components

import React, { useEffect } from 'react';

function ProductPage() {
  useEffect(() => {
    // Check if HanamiTracker is available
    if (window.HanamiTracker) {
      // Get tracking data
      const sessionData = window.HanamiTracker.getSessionData();
      const clickId = window.HanamiTracker.getClickId();
      const lastTracker = window.HanamiTracker.getLastTracker();
      
      console.log('Session data:', sessionData);
      console.log('Click ID:', clickId);
      console.log('Last tracker:', lastTracker);
      
      // You can use this data when making conversion API calls
    }
  }, []);

  return (
    <div>
      <h1>Product Page</h1>
      {/* Product details */}
    </div>
  );
}

export default ProductPage;
`;

  // Map of snippets for each tab
  const snippets: { [key: string]: string } = {
    nextjs: nextjsSnippet,
    react: reactSnippet,
    appcomponent: appComponentSnippet,
    usage: usageSnippet,
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Hanami Tracking SDK Documentation
      </h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Overview</h2>
        <p className="text-gray-600">
          The Hanami Tracking SDK is a lightweight client-side JavaScript library that works with your backend tracking system. 
          It helps you track user interactions, maintain session data, and capture important parameters like UTM sources and click IDs.
          This documentation explains how to integrate the tracking SDK into your Next.js or React applications.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Key Features
        </h2>
        <ul className="list-disc pl-5 text-gray-600">
          <li>Automatically captures UTM parameters and click IDs from URLs</li>
          <li>Maintains consistent cookie structure with your backend implementation</li>
          <li>Provides easy access to tracking data for conversion attribution</li>
          <li>Lightweight and non-blocking implementation</li>
          <li>Compatible with all modern browsers</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Integration Examples
        </h2>
        <div className="border-b border-gray-300 mb-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("nextjs")}
              className={`py-2 px-4 font-medium ${
                activeTab === "nextjs"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500"
              }`}
            >
              Next.js
            </button>
            <button
              onClick={() => setActiveTab("react")}
              className={`py-2 px-4 font-medium ${
                activeTab === "react"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500"
              }`}
            >
              React (index.html)
            </button>
            <button
              onClick={() => setActiveTab("appcomponent")}
              className={`py-2 px-4 font-medium ${
                activeTab === "appcomponent"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500"
              }`}
            >
              React (App Component)
            </button>
            <button
              onClick={() => setActiveTab("usage")}
              className={`py-2 px-4 font-medium ${
                activeTab === "usage"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500"
              }`}
            >
              Using the SDK
            </button>
          </div>
        </div>

        <div className="relative">
          <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
            {snippets[activeTab]}
          </pre>
          <button
            onClick={() => copyToClipboard(snippets[activeTab], activeTab)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 flex items-center"
          >
            <FaCopy />
            <span className="ml-1">
              {copied === activeTab ? "Copied!" : "Copy"}
            </span>
          </button>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          SDK API Reference
        </h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Method</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Return Type</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border"><code>HanamiTracker.init(options)</code></td>
              <td className="p-2 border">
                Initializes the tracking SDK with optional configuration. Called automatically if <code>data-auto-init=&quot;true&quot;</code> is set.
              </td>
              <td className="p-2 border">SDK instance</td>
            </tr>
            <tr>
              <td className="p-2 border"><code>HanamiTracker.getClickId()</code></td>
              <td className="p-2 border">
                Returns the current click ID from the URL or cookie.
              </td>
              <td className="p-2 border">string | null</td>
            </tr>
            <tr>
              <td className="p-2 border"><code>HanamiTracker.getSessionData()</code></td>
              <td className="p-2 border">
                Returns the complete session data from the cookie.
              </td>
              <td className="p-2 border">object | null</td>
            </tr>
            <tr>
              <td className="p-2 border"><code>HanamiTracker.getLastTracker()</code></td>
              <td className="p-2 border">
                Returns the most recent tracker from the session.
              </td>
              <td className="p-2 border">object | null</td>
            </tr>
            <tr>
              <td className="p-2 border"><code>HanamiTracker.getAllTrackers()</code></td>
              <td className="p-2 border">
                Returns all trackers from the current session.
              </td>
              <td className="p-2 border">array</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Integration with Conversion API
        </h2>
        <p className="text-gray-600">
          The Tracking SDK works seamlessly with the Conversion API. When a user makes a purchase or completes another conversion event, 
          you can retrieve the tracking data using the SDK and include it in your conversion API call:
        </p>
        <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto mt-4">
{`// Example of using tracking data with conversion API
import axios from 'axios';

async function recordConversion(amount, currency) {
  // Get session data from Hanami Tracker
  const sessionData = window.HanamiTracker.getSessionData();
  
  if (!sessionData || !sessionData.trackers || sessionData.trackers.length === 0) {
    console.error('No tracking data available');
    return;
  }
  
  // Create conversion request
  const conversionRequest = {
    session_id: sessionData.session_id,
    trackers: sessionData.trackers,
    amount: amount,
    currency: currency
  };
  
  // Send to conversion API
  try {
    const response = await axios.post(
      'https://your-api.promotopia.com/api/conversions',
      conversionRequest,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer <your-api-token>',
        },
      }
    );
    console.log('Conversion recorded successfully:', response.data);
  } catch (error) {
    console.error('Error recording conversion:', error);
  }
}`}
        </pre>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Best Practices
        </h2>
        <ul className="list-disc pl-5 text-gray-600">
          <li>
            <strong>Early Loading:</strong> Add the tracking script as early as possible in your HTML to ensure it captures all relevant data.
          </li>
          <li>
            <strong>Async Loading:</strong> The script is loaded asynchronously by default to prevent blocking page rendering.
          </li>
          <li>
            <strong>Error Handling:</strong> Always check if <code>window.HanamiTracker</code> exists before using its methods.
          </li>
          <li>
            <strong>Testing:</strong> Test the integration with various UTM parameters and click IDs to ensure proper tracking.
          </li>
          <li>
            <strong>Privacy Compliance:</strong> Ensure your cookie usage complies with relevant privacy regulations (GDPR, CCPA, etc.).
          </li>
        </ul>
      </section>
    </div>
  );
};

export default TrackingSDKDocs;
