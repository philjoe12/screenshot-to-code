import toast from "react-hot-toast";
import {
  APP_ERROR_WEB_SOCKET_CODE,
  USER_CLOSE_WEB_SOCKET_CODE,
} from "./constants";
import { FullGenerationSettings } from "./types/types";
import { WS_BACKEND_URL, IS_RUNNING_ON_CLOUD } from "./config";

const ERROR_MESSAGE =
  "Error generating code. Check the Developer Console AND the backend logs for details. Feel free to open a Github issue.";

const CONNECTION_ERROR_MESSAGE = IS_RUNNING_ON_CLOUD
  ? "Error connecting to server. Please try again later."
  : `Error connecting to backend at ${WS_BACKEND_URL}. Make sure your backend service is running.`;

const CANCEL_MESSAGE = "Code generation cancelled";

type WebSocketResponse = {
  type:
    | "chunk"
    | "status"
    | "setCode"
    | "error"
    | "variantComplete"
    | "variantError"
    | "variantCount"
    | "credits";
  value: string;
  variantIndex: number;
};

interface CodeGenerationCallbacks {
  onChange: (chunk: string, variantIndex: number) => void;
  onSetCode: (code: string, variantIndex: number) => void;
  onStatusUpdate: (status: string, variantIndex: number) => void;
  onVariantComplete: (variantIndex: number) => void;
  onVariantError: (variantIndex: number, error: string) => void;
  onVariantCount: (count: number) => void;
  onCancel: () => void;
  onComplete: () => void;
  onCreditsUpdate: (credits: number) => void;
}

export function generateCode(
  wsRef: React.MutableRefObject<WebSocket | null>,
  params: FullGenerationSettings,
  callbacks: CodeGenerationCallbacks
) {
  const wsUrl = `${WS_BACKEND_URL}/generate-code`;
  console.log("Connecting to backend @ ", wsUrl);

  try {
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    let connectionOpened = false;
    let connectionTimeout: NodeJS.Timeout;

    ws.addEventListener("open", () => {
      connectionOpened = true;
      clearTimeout(connectionTimeout);
      console.log("WebSocket connection established successfully");
      ws.send(JSON.stringify(params));
    });

    ws.addEventListener("message", async (event: MessageEvent) => {
      try {
        const response = JSON.parse(event.data) as WebSocketResponse;
        if (response.type === "chunk") {
          callbacks.onChange(response.value, response.variantIndex);
        } else if (response.type === "status") {
          callbacks.onStatusUpdate(response.value, response.variantIndex);
        } else if (response.type === "setCode") {
          callbacks.onSetCode(response.value, response.variantIndex);
        } else if (response.type === "variantComplete") {
          callbacks.onVariantComplete(response.variantIndex);
        } else if (response.type === "variantError") {
          callbacks.onVariantError(response.variantIndex, response.value);
        } else if (response.type === "variantCount") {
          callbacks.onVariantCount(parseInt(response.value));
        } else if (response.type === "credits") {
          callbacks.onCreditsUpdate(parseInt(response.value));
        } else if (response.type === "error") {
          console.error("Error generating code", response.value);
          toast.error(response.value);
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err, event.data);
        toast.error("Error processing server response");
      }
    });

    ws.addEventListener("close", (event) => {
      clearTimeout(connectionTimeout);
      console.log("Connection closed", event.code, event.reason);

      if (event.code === USER_CLOSE_WEB_SOCKET_CODE) {
        toast.success(CANCEL_MESSAGE);
        callbacks.onCancel();
      } else if (event.code === APP_ERROR_WEB_SOCKET_CODE) {
        console.error("Known server error", event);
        toast.error(event.reason || "Server encountered an error");
        callbacks.onCancel();
      } else if (event.code !== 1000) {
        console.error("Unknown server or connection error", event);

        // Different messages for different close codes
        if (event.code === 1006) {
          toast.error("Connection closed abnormally. Backend might be unavailable.");
        } else if (event.code === 1011) {
          toast.error("Server encountered an unexpected error. Please try again.");
        } else {
          toast.error(ERROR_MESSAGE);
        }

        callbacks.onCancel();
      } else {
        // Normal closure
        console.log("WebSocket connection closed normally");
        callbacks.onComplete();
      }
    });

    ws.addEventListener("error", (error) => {
      clearTimeout(connectionTimeout);
      console.error("WebSocket error:", error);

      // More specific error message
      if (!connectionOpened) {
        toast.error(CONNECTION_ERROR_MESSAGE);
      } else {
        toast.error("Connection error occurred. The operation may not complete correctly.");
      }

      // Don't call onCancel() here - wait for the close event which will follow
    });

    // Set a connection timeout
    connectionTimeout = setTimeout(() => {
      if (!connectionOpened) {
        console.error("WebSocket connection timeout");
        toast.error(`Connection timeout: Could not connect to ${wsUrl}`);
        callbacks.onCancel();
        ws.close();
      }
    }, 10000); // 10 seconds timeout

  } catch (error) {
    // This catches errors in WebSocket initialization
    console.error("Failed to create WebSocket connection:", error);
    toast.error(CONNECTION_ERROR_MESSAGE);
    callbacks.onCancel();
  }
}