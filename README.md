# Browser Gemini Agent

This Node.js application provides an intelligent command-line interface (CLI) to control your Chrome browser autonomously. It uses a Gemini AI model to understand natural language commands, breaks them down into browser actions, and then executes these actions via the Browser MCP (Model Context Protocol) server and the associated Chrome extension.

## Features

-   **Natural Language Control:** Instruct your browser using plain English commands.
-   **AI-Powered Action Planning:** Leverages a Gemini AI model (configurable, defaults to `gemini-2.5-flash-lite-preview-06-17`) to translate your commands into executable browser steps.
-   **Browser Automation:** Interacts with the Browser MCP server to perform actions in Chrome.
-   **Data Retrieval:** Capable of extracting information from web pages (e.g., text of elements, attributes) and displaying it in the CLI.

## Prerequisites

1.  **Node.js**: Ensure Node.js (version 16.x or higher recommended) is installed. Download from [https://nodejs.org/](https://nodejs.org/).
2.  **Gemini API Key**: You need an API key for the Gemini Large Language Model.
    *   Obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
3.  **Browser MCP Chrome Extension**: Install the "Browser MCP" extension from the Chrome Web Store.
4.  **Browser MCP Server**: The Browser MCP server must be running. Typically, you start this in a separate terminal using `npx @browsermcp/mcp@latest`.
5.  **Connect Extension to Server**: Open the Browser MCP extension in Chrome and ensure it's connected to the running MCP server. The browser tab you intend to control should be the one connected via the extension.

## Setup

1.  **Clone the repository (if applicable) or download the files.**
    If this agent is part of a larger project or repository:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
    Ensure `agent.js`, `package.json`, and `.gitignore` are in the project directory.

2.  **Install dependencies:**
    Navigate to the project directory in your terminal and run:
    ```bash
    npm install
    ```
    This installs `@google/generative-ai`, `@browsermcp/mcp`, `dotenv`, and other necessary packages.

3.  **Configure API Key:**
    *   Create a file named `.env` in the root of the project directory.
    *   Add your Gemini API key to this file:
        ```env
        GEMINI_API_KEY=YOUR_ACTUAL_GEMINI_API_KEY
        ```
    *   You can optionally specify a different Gemini model or Browser MCP server port in the `.env` file (see `.env.example` for details).
        ```env
        # Example:
        # GEMINI_MODEL="gemini-pro"
        # BROWSER_MCP_PORT=61001
        ```
    *   The `.env` file is ignored by Git (as specified in `.gitignore`).

## Running the Agent

1.  **Start the Browser MCP Server:**
    Open a new terminal window/tab and run:
    ```bash
    npx @browsermcp/mcp@latest
    ```
    Keep this server running. Note any port information it outputs (defaults to `61000` in the agent if not specified).

2.  **Connect the Chrome Extension:**
    - Open Chrome.
    - Click on the Browser MCP extension icon.
    - Ensure it's connected to the server you just started. The tab you want to control must be the active one connected through the extension.

3.  **Run the Agent CLI:**
    Open another terminal window/tab, navigate to this project's directory, and run:
    ```bash
    node agent.js
    ```

4.  **Interact with the Agent:**
    The agent will initialize the Gemini client and display a prompt: `mcp-gemini-agent>`.
    Type your commands in natural language. Examples:
    ```
    mcp-gemini-agent> Go to google.com and search for "latest AI news"
    mcp-gemini-agent> Navigate to wikipedia.org and find the main heading text.
    mcp-gemini-agent> Go to github.com, type "BrowserMCP" in the search bar, and click the search button.
    ```
    The agent will:
    *   Send your command to the Gemini model.
    *   Receive a sequence of browser actions from Gemini.
    *   Execute these actions one by one using the Browser MCP server.
    *   Display results or retrieved data in the CLI.

    To quit the agent, type:
    ```
    mcp-gemini-agent> exit
    ```

## How it Works

1.  **CLI (`agent.js` with `readline`):** Takes your text command.
2.  **Gemini AI (`@google/generative-ai`):**
    *   Your command is sent to the configured Gemini model along with a detailed system prompt.
    *   The system prompt instructs Gemini to act as a browser control assistant and convert the command into a JSON array of specific browser actions (e.g., navigate, click, type, get text).
3.  **Action Execution Loop (`agent.js`):**
    *   The agent parses the JSON array of actions from Gemini.
    *   It iterates through each action.
4.  **Browser MCP Client (`sendCommandToMcpServer` in `agent.js`):**
    *   Each action object is sent as an HTTP POST request (JSON payload) to the running Browser MCP server (default `http://localhost:61000/mcp`).
    *   The server is expected to process these actions.
5.  **Browser MCP Server (`@browsermcp/mcp` package):**
    *   This external server (run by `npx ...`) listens for commands.
6.  **Browser MCP Chrome Extension:**
    *   The extension, connected to the server, executes the commands in your active Chrome tab.
    *   For data retrieval actions (like getting text), the server should send back the data, which the agent then displays.

## Important Notes & Current Status

*   **Browser MCP Server API:** The agent assumes the Browser MCP server listens on `http://localhost:61000/mcp` and accepts actions in the format defined in the Gemini prompt. **These details (port, endpoint path, exact request/response schemas) need to be verified against the actual Browser MCP server implementation for reliable operation.**
*   **Module Loading in Sandbox:** During development in some sandboxed environments, issues were noted with Node.js module loading (`MODULE_NOT_FOUND`). Ensure you are in a standard Node.js environment where installed `node_modules` are correctly resolved.
*   **Error Handling:** Basic error handling is in place. If Gemini fails to provide actions or if a browser action fails, the agent will report an error. Sequences of actions typically stop on the first error.
*   **Security:** Always handle your `GEMINI_API_KEY` securely. Do not commit it to version control.

## Future Development / Refinements

-   Confirm and stabilize the Browser MCP server communication (port, endpoint, payload formats).
-   Enhance the Gemini prompt for more complex scenarios and improved reliability.
-   Add more sophisticated error handling and recovery options (e.g., retries, skipping steps).
-   Implement more advanced data extraction and presentation.
-   Allow configuration of Gemini parameters (temperature, top_k, etc.).
