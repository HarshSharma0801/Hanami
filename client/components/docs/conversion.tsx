"use client";
import React, { useState } from "react";
import { FaCopy } from "react-icons/fa";

const ConversionApiDocs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("typescript");
  const [copied, setCopied] = useState<string>("");

  const copyToClipboard = (text: string, snippetId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(snippetId);
      setTimeout(() => setCopied(""), 2000);
    });
  };

  const typescriptSnippet = `
import axios, { AxiosError } from 'axios';

// API base URL
const API_BASE_URL = 'https://your-api.promotopia.com';

// Interface for a tracker
interface Tracker {
  click_id: string;
  tracking_code: string;
  utm_source?: string;
  utm_medium?: string;
  timestamp: string;
}

// Interface for the conversion request
interface ConversionRequest {
  session_id: string;
  trackers: Tracker[];
  amount: number;
  currency: 'USD' | 'INR' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD';
}

// Function to create a conversion
async function createConversion(request: ConversionRequest): Promise<void> {
  try {
    const response = await axios.post(
      \`\${API_BASE_URL}/api/conversions\`,
      request,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer <your-api-token>',
        },
      }
    );
    console.log('Conversion created successfully:', response.data);
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    console.error('Error creating conversion:', axiosError.response?.data?.error || 'Unknown error');
    throw error;
  }
}

// Example usage
const conversionRequest: ConversionRequest = {
  session_id: '9b4b219d-c669-4d20-b14a-e2d0de36d007',
  trackers: [
    {
      click_id: '323dbb5f-49ac-4415-afd3-4ad841fa97c6',
      tracking_code: '105802',
      utm_source: 'facebook',
      utm_medium: 'social',
      timestamp: '2025-03-27T15:50:00Z',
    },
    {
      click_id: '47c29a46-97d8-4b47-bfaa-1fab24082d4b',
      tracking_code: '105802',
      utm_source: 'facebook',
      utm_medium: 'banner',
      timestamp: '2025-03-27T15:51:00Z',
    },
  ],
  amount: 100.00,
  currency: 'USD',
};

createConversion(conversionRequest);
`;

  const javascriptSnippet = `
const axios = require('axios');

// API base URL
const API_BASE_URL = 'https://your-api.promotopia.com';

// Function to create a conversion
async function createConversion(request) {
  try {
    const response = await axios.post(
      \`\${API_BASE_URL}/api/conversions\`,
      request,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer <your-api-token>',
        },
      }
    );
    console.log('Conversion created successfully:', response.data);
  } catch (error) {
    console.error('Error creating conversion:', error.response?.data?.error || 'Unknown error');
    throw error;
  }
}

// Example usage
const conversionRequest = {
  session_id: '9b4b219d-c669-4d20-b14a-e2d0de36d007',
  trackers: [
    {
      click_id: '323dbb5f-49ac-4415-afd3-4ad841fa97c6',
      tracking_code: '105802',
      utm_source: 'facebook',
      utm_medium: 'social',
      timestamp: '2025-03-27T15:50:00Z',
    },
    {
      click_id: '47c29a46-97d8-4b47-bfaa-1fab24082d4b',
      tracking_code: '105802',
      utm_source: 'facebook',
      utm_medium: 'banner',
      timestamp: '2025-03-27T15:51:00Z',
    },
  ],
  amount: 100.00,
  currency: 'USD',
};

createConversion(conversionRequest);
`;

  const pythonSnippet = `
import requests

# API base URL
API_BASE_URL = 'https://your-api.promotopia.com'

# Function to create a conversion
def create_conversion(request):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer <your-api-token>',
    }
    try:
        response = requests.post(
            f'{API_BASE_URL}/api/conversions',
            json=request,
            headers=headers
        )
        response.raise_for_status()  # Raises an HTTPError for bad responses
        print('Conversion created successfully:', response.json())
    except requests.exceptions.RequestException as e:
        print('Error creating conversion:', e.response.json().get('error', 'Unknown error') if e.response else 'Unknown error')
        raise

# Example usage
conversion_request = {
    'session_id': '9b4b219d-c669-4d20-b14a-e2d0de36d007',
    'trackers': [
        {
            'click_id': '323dbb5f-49ac-4415-afd3-4ad841fa97c6',
            'tracking_code': '105802',
            'utm_source': 'facebook',
            'utm_medium': 'social',
            'timestamp': '2025-03-27T15:50:00Z',
        },
        {
            'click_id': '47c29a46-97d8-4b47-bfaa-1fab24082d4b',
            'tracking_code': '105802',
            'utm_source': 'facebook',
            'utm_medium': 'banner',
            'timestamp': '2025-03-27T15:51:00Z',
        },
    ],
    'amount': 100.00,
    'currency': 'USD',
}

create_conversion(conversion_request)
`;

  const goSnippet = `
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
)

// API base URL
const APIBaseURL = "https://your-api.promotopia.com"

// Tracker represents a single click event
type Tracker struct {
    ClickID      string \`json:"click_id"\`
    TrackingCode string \`json:"tracking_code"\`
    UtmSource    string \`json:"utm_source,omitempty"\`
    UtmMedium    string \`json:"utm_medium,omitempty"\`
    Timestamp    string \`json:"timestamp"\`
}

// ConversionRequest represents the request body
type ConversionRequest struct {
    SessionID string    \`json:"session_id"\`
    Trackers  []Tracker \`json:"trackers"\`
    Amount    float64   \`json:"amount"\`
    Currency  string    \`json:"currency"\`
}

// CreateConversion makes the API call to create a conversion
func CreateConversion(request ConversionRequest) error {
    body, err := json.Marshal(request)
    if err != nil {
        return fmt.Errorf("failed to marshal request: %v", err)
    }

    req, err := http.NewRequest("POST", APIBaseURL+"/api/conversions", bytes.NewBuffer(body))
    if err != nil {
        return fmt.Errorf("failed to create request: %v", err)
    }

    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("Authorization", "Bearer <your-api-token>")

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return fmt.Errorf("failed to send request: %v", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        var errorResp struct {
            Error string \`json:"error"\`
        }
        if err := json.NewDecoder(resp.Body).Decode(&errorResp); err != nil {
            return fmt.Errorf("failed to decode error response: %v", err)
        }
        return fmt.Errorf("error creating conversion: %s", errorResp.Error)
    }

    var response struct {
        Conversions []interface{} \`json:"conversions"\`
    }
    if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
        return fmt.Errorf("failed to decode response: %v", err)
    }

    fmt.Println("Conversion created successfully:", response.Conversions)
    return nil
}

func main() {
    conversionRequest := ConversionRequest{
        SessionID: "9b4b219d-c669-4d20-b14a-e2d0de36d007",
        Trackers: []Tracker{
            {
                ClickID:      "323dbb5f-49ac-4415-afd3-4ad841fa97c6",
                TrackingCode: "105802",
                UtmSource:    "facebook",
                UtmMedium:    "social",
                Timestamp:    "2025-03-27T15:50:00Z",
            },
            {
                ClickID:      "47c29a46-97d8-4b47-bfaa-1fab24082d4b",
                TrackingCode: "105802",
                UtmSource:    "facebook",
                UtmMedium:    "banner",
                Timestamp:    "2025-03-27T15:51:00Z",
            },
        },
        Amount:   100.00,
        Currency: "USD",
    }

    if err := CreateConversion(conversionRequest); err != nil {
        fmt.Println("Error:", err)
    }
}
`;

  // Map of snippets for each tab
  const snippets: { [key: string]: string } = {
    typescript: typescriptSnippet,
    javascript: javascriptSnippet,
    python: pythonSnippet,
    go: goSnippet,
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Hanami Conversion API Documentation
      </h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Overview</h2>
        <p className="text-gray-600">
          The <code>create_conversion</code> endpoint allows brand developers to
          record a conversion event (e.g., a purchase) by sending a list of
          trackers (clicks) that contributed to the conversion. The endpoint
          calculates attribution weights using the U-Shaped (Position-Based)
          model and stores the conversion data for each tracker, including the
          session ID, amount, currency, and weight.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Endpoint Details
        </h2>
        <ul className="list-disc pl-5 text-gray-600">
          <li>
            <strong>Method:</strong> POST
          </li>
          <li>
            <strong>URL:</strong> <code>/api/conversions</code>
          </li>
          <li>
            <strong>Content-Type:</strong> <code>application/json</code>
          </li>
          <li>
            <strong>Authentication:</strong> Requires an API token in the{" "}
            <code>Authorization</code> header (e.g.,{" "}
            <code>Bearer &lt;your-api-token&gt;</code>).
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Request Structure
        </h2>
        <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
          {`{
  "session_id": "string", // UUID of the session
  "trackers": [
    {
      "click_id": "string", // UUID of the click
      "tracking_code": "string", // Tracking code (e.g., affiliate's code)
      "utm_source": "string", // Optional UTM source
      "utm_medium": "string", // Optional UTM medium
      "timestamp": "string" // ISO 8601 timestamp
    }
  ],
  "amount": number, // Conversion amount
  "currency": "string" // ISO 4217 currency code
}`}
        </pre>
        <h3 className="text-xl font-medium text-gray-700 mt-4 mb-2">
          Required Fields
        </h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Field</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Required</th>
              <th className="p-2 border">Constraints</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border">session_id</td>
              <td className="p-2 border">string</td>
              <td className="p-2 border">
                Unique identifier for the user session (UUID format).
              </td>
              <td className="p-2 border">Yes</td>
              <td className="p-2 border">Must be a valid UUID.</td>
            </tr>
            <tr>
              <td className="p-2 border">trackers</td>
              <td className="p-2 border">Tracker[]</td>
              <td className="p-2 border">
                Array of trackers (clicks) that contributed to the conversion.
              </td>
              <td className="p-2 border">Yes</td>
              <td className="p-2 border">Must contain at least 1 tracker.</td>
            </tr>
            <tr>
              <td className="p-2 border">amount</td>
              <td className="p-2 border">number</td>
              <td className="p-2 border">
                The conversion amount (e.g., purchase value).
              </td>
              <td className="p-2 border">Yes</td>
              <td className="p-2 border">Must be greater than 0.</td>
            </tr>
            <tr>
              <td className="p-2 border">currency</td>
              <td className="p-2 border">string</td>
              <td className="p-2 border">
                The currency of the conversion amount (ISO 4217 code).
              </td>
              <td className="p-2 border">Yes</td>
              <td className="p-2 border">
                Must be one of: USD, INR, EUR, GBP, JPY, CAD, AUD.
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Integration Examples
        </h2>
        <div className="border-b border-gray-300 mb-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("typescript")}
              className={`py-2 px-4 font-medium ${
                activeTab === "typescript"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500"
              }`}
            >
              TypeScript
            </button>
            <button
              onClick={() => setActiveTab("javascript")}
              className={`py-2 px-4 font-medium ${
                activeTab === "javascript"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500"
              }`}
            >
              JavaScript
            </button>
            <button
              onClick={() => setActiveTab("python")}
              className={`py-2 px-4 font-medium ${
                activeTab === "python"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500"
              }`}
            >
              Python
            </button>
            <button
              onClick={() => setActiveTab("go")}
              className={`py-2 px-4 font-medium ${
                activeTab === "go"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500"
              }`}
            >
              Go
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
          Response Structure
        </h2>
        <h3 className="text-xl font-medium text-gray-700 mb-2">
          Success (200 OK)
        </h3>
        <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
          {`{
  "conversions": [
    {
      "id": 1,
      "click_id": "323dbb5f-49ac-4415-afd3-4ad841fa97c6",
      "session_id": "9b4b219d-c669-4d20-b14a-e2d0de36d007",
      "amount": 100.00,
      "currency": "USD",
      "weight": 0.4,
      "timestamp": "2025-03-27T15:55:00Z"
    }
  ]
}`}
        </pre>
        <h3 className="text-xl font-medium text-gray-700 mt-4 mb-2">
          Error (e.g., 400 Bad Request)
        </h3>
        <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
          {`{
  "error": "At least one tracker is required"
}`}
        </pre>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Attribution Model
        </h2>
        <p className="text-gray-600">
          The endpoint uses the <strong>U-Shaped (Position-Based)</strong> model
          to assign weights:
        </p>
        <ul className="list-disc pl-5 text-gray-600">
          <li>
            1 tracker: 100% (<code>1.0</code>).
          </li>
          <li>
            2 trackers: 40% first, 40% last (<code>[0.4, 0.4]</code>).
          </li>
          <li>
            3+ trackers: 40% first, 40% last, 20% distributed equally among
            middle trackers (e.g., 4 trackers: <code>[0.4, 0.1, 0.1, 0.4]</code>
            ).
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Error Handling
        </h2>
        <ul className="list-disc pl-5 text-gray-600">
          <li>
            <strong>400 Bad Request:</strong> Invalid request format, missing
            required fields, or invalid UUIDs.
          </li>
          <li>
            <strong>401 Unauthorized:</strong> Missing or invalid API token.
          </li>
          <li>
            <strong>500 Internal Server Error:</strong> Database or server
            issues.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default ConversionApiDocs;
