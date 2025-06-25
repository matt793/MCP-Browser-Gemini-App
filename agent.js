require('dotenv').config(); // Load environment variables from .env file

const { GoogleGenerativeAI } = require('@google/generative-ai');
const readline = require('readline');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite-preview-06-17"; // User specified model

if (!GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY is not defined. Please create a .env file with your API key.");
  process.exit(1);
}

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_NAME });

console.log(`Gemini AI client initialized with model: ${GEMINI_MODEL_NAME}`);

// CLI Interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'mcp-gemini-agent> '
});

async function runCLI() {
  console.log("\nBrowser Control Agent (with Gemini)");
  console.log("------------------------------------");
  console.log("Type your command to control the browser, or type 'exit' to quit.");
  console.log("Example: Go to twitter.com and show me the latest 3 tweets from user @Google.");
  console.log("Ensure the Browser MCP server is running and the Chrome extension is connected to it.\n");

  rl.prompt();

  rl.on('line', async (line) => {
    const command = line.trim();

    if (command.toLowerCase() === 'exit') {
      console.log('Exiting agent...');
      rl.close();
      return;
    }

    if (command) {
      console.log(`User command: "${command}"`);
      try {
        const geminiResult = await getActionsFromGemini(command);
        if (geminiResult.error) {
          console.error(`[Agent] Error from Gemini processing: ${geminiResult.error}`);
        } else if (geminiResult.actions && geminiResult.actions.length > 0) {
          console.log(`[Agent] Received ${geminiResult.actions.length} actions from Gemini.`);
          await executeActions(geminiResult.actions);
        } else {
          console.log("[Agent] Gemini did not return any actions or the command resulted in no actions.");
        }
      } catch (error) {
        // This catch block might be redundant if getActionsFromGemini itself catches and returns an error object.
        // However, it's good for unexpected issues during the call itself.
        console.error("[Agent] Critical error during Gemini interaction:", error);
      }
    }
    // Re-prompt only if the CLI is still active
    if (rl.readable && rl.writable && !rl.closing) {
        rl.prompt();
    }
  });

  rl.on('close', () => {
    console.log('CLI session ended.');
    process.exit(0);
  });
}

// Placeholder for sending command to Gemini (to be implemented in next step)
async function getActionsFromGemini(userCommand) {
  console.log(`[Gemini] Processing user command: "${userCommand}"`);

  const systemPrompt = `You are an expert AI assistant that helps users control a web browser.
Your goal is to convert a user's natural language command into a precise, step-by-step sequence of actions that can be executed by a browser automation tool.

The browser automation tool understands the following actions. Output your response as a valid JSON array of action objects. Each object in the array represents a single action.

Available Actions and their JSON structure:

1.  **Navigate to a URL:**
    \`{ "action": "navigateToUrl", "url": "https://example.com" }\`

2.  **Click an element:**
    \`{ "action": "clickElement", "selector": "css_selector_for_element" }\`
    (Use CSS selectors. Be specific. If multiple elements match, the first one will be clicked.)

3.  **Type text into an input field:**
    \`{ "action": "typeInElement", "selector": "css_selector_for_input_field", "text": "text_to_type", "submit": false }\`
    (Set "submit" to true if the typing should also trigger a form submission, e.g., by pressing Enter. Defaults to false.)

4.  **Get text content from an element:**
    \`{ "action": "getElementText", "selector": "css_selector_for_element" }\`
    (This action will return the text content of the specified element.)

5.  **Get an attribute from an element:**
    \`{ "action": "getElementAttribute", "selector": "css_selector_for_element", "attributeName": "name_of_attribute" }\`
    (e.g., "href" for links, "value" for input fields after typing)

6.  **Scroll window:**
    \`{ "action": "scrollWindow", "scrollX": 0, "scrollY": 1000 }\` (Scrolls down by 1000 pixels)
    \`{ "action": "scrollWindow", "direction": "bottom" }\` (Scrolls to the bottom of the page)
    (Valid directions: "top", "bottom", or specify scrollX/scrollY pixel values)

7.  **Wait for a specific duration:**
    \`{ "action": "wait", "milliseconds": 5000 }\` (Waits for 5 seconds)

8.  **Wait for an element to be visible:**
    \`{ "action": "waitForElement", "selector": "css_selector_for_element", "timeout": 30000 }\`
    (Waits up to 'timeout' milliseconds for the element to appear. Default timeout is 30 seconds if not specified.)

Think step-by-step. Consider common web interaction patterns.
For example, if a user says "search for X on Google", the steps would be:
1. Navigate to google.com
2. Type "X" into the search bar (identify its CSS selector)
3. Click the search button (identify its CSS selector) or submit the form.

If the user asks to retrieve information (e.g., "what's the title of this page?" or "get the links from the navigation bar"), use \`getElementText\` or \`getElementAttribute\`.

Ensure your output is ONLY the JSON array of actions. Do not include any other text, explanations, or markdown formatting around the JSON.

User command: "${userCommand}"
JSON array of actions:`;

  let rawResponseText = ""; // Initialize to ensure it's defined in catch block
  try {
    const result = await model.generateContent(systemPrompt);
    const response = result.response;
    rawResponseText = response.text().trim();

    console.log(`[Gemini] Raw response: ${rawResponseText}`);

    // Attempt to parse the JSON
    // Gemini might sometimes wrap its JSON in ```json ... ```, so try to strip that.
    let cleanedJsonResponseText = rawResponseText;
    if (cleanedJsonResponseText.startsWith("```json")) {
      cleanedJsonResponseText = cleanedJsonResponseText.substring(7); // Remove ```json\n
      if (cleanedJsonResponseText.endsWith("```")) {
        cleanedJsonResponseText = cleanedJsonResponseText.substring(0, cleanedJsonResponseText.length - 3);
      }
    }
    cleanedJsonResponseText = cleanedJsonResponseText.trim();

    if (!cleanedJsonResponseText) {
        console.warn("[Gemini] Received empty response after cleaning.");
        return { error: "Gemini returned an empty response.", actions: [] };
    }

    const actions = JSON.parse(cleanedJsonResponseText);
    console.log(`[Gemini] Parsed actions:`, actions);
    return { actions: actions };
  } catch (error) {
    console.error("[Gemini] Error processing command or parsing response:", error.message);
    console.error("[Gemini] Raw response text that caused error:", rawResponseText || "No response text captured prior to error.");
    // Return an error object along with empty actions
    return { error: `Failed to parse Gemini response: ${error.message}`, actions: [] };
  }
}

const http = require('http');

const BROWSER_MCP_PORT = parseInt(process.env.BROWSER_MCP_PORT || "61000", 10); // Default to 61000
const BROWSER_MCP_HOST = process.env.BROWSER_MCP_HOST || "localhost";

// Function to send a single action to the Browser MCP server
async function sendCommandToMcpServer(actionObject) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(actionObject);
    const options = {
      hostname: BROWSER_MCP_HOST,
      port: BROWSER_MCP_PORT,
      path: '/mcp', // Assuming a generic endpoint, this might need to be /mcp/action or similar
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    console.log(`[MCP] Sending action to ${BROWSER_MCP_HOST}:${BROWSER_MCP_PORT}:`, actionObject);

    const req = http.request(options, (res) => {
      let responseData = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        console.log(`[MCP] Response status: ${res.statusCode}`);
        console.log(`[MCP] Response data: ${responseData}`);
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const parsedResponse = responseData ? JSON.parse(responseData) : {};
            resolve(parsedResponse); // Contains data for getElementText etc.
          } else {
            const errorData = responseData ? JSON.parse(responseData) : { message: "Unknown error" };
            reject(new Error(`MCP Server responded with ${res.statusCode}: ${errorData.message || responseData}`));
          }
        } catch (parseError) {
          console.error("[MCP] Error parsing server response:", parseError);
          reject(new Error(`Error parsing MCP server response: ${parseError.message}. Raw: ${responseData}`));
        }
      });
    });

    req.on('error', (e) => {
      console.error(`[MCP] Problem with request: ${e.message}`);
      if (e.code === 'ECONNREFUSED') {
        reject(new Error(`Connection refused at ${BROWSER_MCP_HOST}:${BROWSER_MCP_PORT}. Is the Browser MCP server running?`));
      } else {
        reject(e);
      }
    });

    req.write(postData);
    req.end();
  });
}


// Placeholder for executing actions via Browser MCP (to be implemented later)
async function executeActions(actions) {
  if (!actions || actions.length === 0) {
    console.log("[Agent] No actions to execute.");
    return;
  }

  console.log(`[Agent] Starting execution of ${actions.length} actions...`);
  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    console.log(`[Agent] Executing action ${i + 1}/${actions.length}: ${JSON.stringify(action)}`);
    try {
      const result = await sendCommandToMcpServer(action);
      console.log(`[Agent] Action ${i + 1} successful.`);

      // Handle data returned from specific actions
      if (action.action === "getElementText" && result && result.text !== undefined) {
        console.log(`[Agent] Retrieved text: "${result.text}"`);
      } else if (action.action === "getElementAttribute" && result && result.value !== undefined) {
        console.log(`[Agent] Retrieved attribute "${action.attributeName}": "${result.value}"`);
      } else if (result && Object.keys(result).length > 0) {
        // Log any other non-empty results
        console.log(`[Agent] Action result: ${JSON.stringify(result)}`);
      }

    } catch (error) {
      console.error(`[Agent] Error executing action ${i + 1} (${JSON.stringify(action.action)}): ${error.message}`);
      console.error("[Agent] Aborting further actions in this sequence due to error.");
      // Optionally, ask user if they want to continue or stop
      // For now, we stop the sequence on first error.
      return; // Stop executing further actions
    }
    // Optional: Add a small delay between actions if needed
    // if (i < actions.length - 1) {
    //   await new Promise(resolve => setTimeout(resolve, 500)); // 0.5 second delay
    // }
  }
  console.log("[Agent] All actions executed successfully.");
}

runCLI().catch(console.error);
