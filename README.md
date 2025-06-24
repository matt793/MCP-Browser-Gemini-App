# Browser MCP Agent

This Node.js application provides a command-line interface (CLI) to interact with the Browser MCP (Model Context Protocol) server. It allows you to send commands to control your Chrome browser autonomously, provided the Browser MCP extension is installed in Chrome and the Browser MCP server is running.

## Prerequisites

1.  **Node.js**: Ensure Node.js is installed on your system. You can download it from [https://nodejs.org/](https://nodejs.org/).
2.  **Browser MCP Chrome Extension**: Install the "Browser MCP" extension from the Chrome Web Store.
3.  **Browser MCP Server**: The Browser MCP server must be running. Typically, you start this using `npx @browsermcp/mcp@latest` in your terminal.
4.  **Connect Extension to Server**: Open the Browser MCP extension in Chrome and ensure it's connected to the running MCP server.

## Setup

1.  **Clone the repository (if applicable) or download the files.**
    If this agent is part of a larger project or repository:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
    If you just have `agent.js` and `package.json`:
    Ensure `agent.js`, `package.json`, and `.gitignore` are in the same directory.

2.  **Install dependencies:**
    Navigate to the project directory in your terminal and run:
    ```bash
    npm install
    ```
    This will install the necessary packages, including `@browsermcp/mcp` (which contains the server logic and potentially client utilities we might use later).

## Running the Agent CLI

1.  **Start the Browser MCP Server:**
    Open a new terminal window/tab and run:
    ```bash
    npx @browsermcp/mcp@latest
    ```
    Keep this server running. Note the port it's running on (it might show in its startup logs, or it might use a default like 61000 or another port specific to BrowserMCP).

2.  **Connect the Chrome Extension:**
    - Open Chrome.
    - Click on the Browser MCP extension icon.
    - Ensure it shows "Connected" or follow its UI to connect to the server you just started. The tab you want to control should be active and connected via the extension.

3.  **Run the Agent CLI:**
    Open another terminal window/tab, navigate to this project's directory, and run:
    ```bash
    node agent.js
    ```

4.  **Interact with the CLI:**
    You will see a prompt `mcp-agent>`. Type your commands here.
    For example:
    ```
    mcp-agent> Go to google.com and search for cats
    ```
    The agent will then (eventually, once fully implemented) send this command to the Browser MCP server, which will execute it in your Chrome browser.

    To quit the agent CLI, type:
    ```
    mcp-agent> exit
    ```

## How it Works (Current Stage)

-   `agent.js`: This is the main script for the CLI.
    - It uses Node.js's `readline` module to get user input.
    - It currently has a placeholder function (`sendCommandToMcpServer`) that simulates sending commands. The actual communication logic with the Browser MCP server is yet to be fully implemented.
-   Browser MCP Server (`@browsermcp/mcp`): This is a separate process that needs to be running. It listens for commands.
-   Browser MCP Chrome Extension: This extension, running in your browser, connects to the Browser MCP server and executes the commands it receives on the currently active/connected browser tab.

## Future Development

-   Implement the `sendCommandToMcpServer` function in `agent.js` to establish a proper connection with the running Browser MCP server (likely using client libraries from `@modelcontextprotocol/sdk` or utilities exposed by `@browsermcp/mcp`).
-   Determine the correct port and communication protocol for the Browser MCP server.
-   Handle responses and errors from the MCP server more robustly.
-   Add more sophisticated command parsing or options if needed.

## Troubleshooting

-   **"Error: connect ECONNREFUSED" (or similar in `sendCommandToMcpServer` once implemented):**
    - Ensure the Browser MCP server (`npx @browsermcp/mcp@latest`) is running.
    - Verify the port number used by the client matches the one the server is listening on.
    - Check firewall settings if the server and client are on different machines (though typically they run on the same machine).
-   **Commands don't execute in Chrome:**
    - Ensure the Browser MCP Chrome extension is installed, enabled, and connected to the server.
    - Make sure the correct tab in Chrome is active and connected via the extension's UI.
    - Check the Browser MCP server's console output for any errors or logs.
-   **`npm install` issues:**
    - Ensure you have a stable internet connection.
    - Try removing `node_modules` and `package-lock.json` and running `npm install` again.
    ```bash
    rm -rf node_modules package-lock.json
    npm install
    ```
    (Use `rd /s /q node_modules` and `del package-lock.json` on Windows CMD).
