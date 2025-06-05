// Static list of macOS apps - no API call needed
const staticFiles = [
  "Safari.app",
  "Mail.app",
  "Messages.app",
  "Maps.app",
  "Photos.app",
  "FaceTime.app",
  "Calendar.app",
  "Contacts.app",
  "Reminders.app",
  "Notes.app",
  "Music.app",
  "Podcasts.app",
  "TV.app",
  "News.app",
  "Stocks.app",
  "Voice Memos.app",
  "Books.app",
  "App Store.app",
  "System Settings.app",
  "Terminal.app",
  "TextEdit.app",
  "Preview.app",
  "Calculator.app",
  "Dictionary.app",
  "Time Machine.app",
]

// Enhanced mock analysis results with detailed security analysis
const mockAnalysisResults: Record<string, string> = {
  "Messages.app": `### Initial Binary Analysis

#### File Information
- **Type:** Mach-O universal binary with two architectures: x86_64 and arm64e.

#### Dependencies
- Notable frameworks: ImageIO, CoreGraphics, Foundation, CoreFoundation, UIKit, Contacts, ChatKit.
- These libraries are potentially involved in image handling, UI operations, and message management.

#### Architecture
- **CPU Types:** x86_64 and arm64e.

#### Code Signing
- Lack of specific code signing information from the command.

### Dynamic Shell Investigation

#### Areas of Interest
1. **CoreGraphics**: Graphical operations.
2. **ImageIO**: Image input/output operations.

#### Shell Investigation Commands
1. \`nm /System/Applications/Messages.app/Contents/MacOS/Messages | grep -i coregraphics | head -20\`
2. \`strings /System/Applications/Messages.app/Contents/MacOS/Messages | grep -i imageio | head -20\`

### Ghidra Function Analysis

#### Selected Functions for Detailed Analysis

1. **_CGImageSourceSetAllowableTypes**
   - **Address:** \`0x100022a70\`
   - **Purpose:** Related to setting image types, likely manages allowable image formats.
   - **Risk:** Low direct risk, but involved in processing image types.

2. **_messageReceived:**
   - **Address:** \`0x10001c5dc\`
   - **Purpose:** Handles message receipt, performs checks on message state.
   - **Risk:** Medium; message handling functions are critical for zero-click vulnerabilities.

3. **imageFromView:**
   - **Purpose:** Converts UI view content into image form using graphical context functions.
   - **Risk:** Medium; improper management of view content and context may lead to information leakage.

4. **saveImage:filePath:fileName:withHeader:**
   - **Purpose:** Saves image to a file, involving file I/O operations.
   - **Risk:** High; mishandling of file operations can lead to unauthorized filesystem access.

5. **_sendMessage**
   - **Purpose:** Manages message sending, verifying destination and content.
   - **Risk:** High; vulnerabilities in this function could allow unauthorized message sending.

6. **showNextMessage**
   - **Purpose:** Displays the next message in the UI, interacts with chat/conversation systems.
   - **Risk:** Medium; improper access control could allow unauthorized access to messages.

### Comprehensive Vulnerability Reasoning

Through the decompilation and analysis, several functions related to message handling, image processing, and view image captures were identified as significant points of interest. 

#### Key Observations

1. **Message Handling Functions (_messageReceived, _sendMessage):**
   - The complexity of these functions and their critical role in communication indicates potential for exploitation if input validation is insufficient.

2. **Image Functions (imageFromView, saveImage:filePath:fileName:withHeader:):**
   - Functions linked to image processing are common vectors for buffer overflow vulnerabilities. Required condition checks should be audited.

3. **General Parsing and Context Usage:**
   - The use of graphical context operations indicates potential for misuse or leakage of sensitive UI components.

### Conclusion

The preliminary analysis indicates potential vulnerabilities in message and image processing functions. The identified functions would benefit from further security audits focusing on:
- Memory management (e.g., buffer overflows, use-after-free bugs).
- Thoroughly inspecting how input data is parsed and validated.
- Investigating file I/O operations to ensure they follow secure access controls. 

This extensive analysis provides a foundational understanding of the potential risk areas and highlights the critical attack surfaces for further investigation. Further dynamic analysis and targeted fuzzing may be required to substantiate these findings and discover latent vulnerabilities.`,

  "Safari.app": `### Initial Binary Analysis

#### File Information
- **Type:** Mach-O universal binary with architectures: x86_64 and arm64e.

#### Dependencies
- Notable frameworks: WebKit, JavaScriptCore, CoreFoundation, Security, Network.
- Critical components for web rendering, JavaScript execution, and network operations.

#### Architecture
- **CPU Types:** x86_64 and arm64e.

### WebKit Engine Analysis

#### Areas of Interest
1. **JavaScript Engine**: V8/JavaScriptCore execution environment.
2. **DOM Parser**: HTML/XML parsing and rendering.
3. **Network Stack**: HTTP/HTTPS request handling.

### Critical Function Analysis

1. **webView:didReceiveServerRedirectForProvisionalNavigation:**
   - **Risk:** High; improper redirect validation could lead to URL spoofing.

2. **evaluateJavaScript:completionHandler:**
   - **Risk:** Critical; JavaScript execution without proper sandboxing.

3. **loadRequest:**
   - **Risk:** Medium; network request validation and CORS enforcement.

### Vulnerability Assessment

#### High-Risk Areas
- JavaScript execution engine
- URL parsing and validation
- Cookie and session management
- Cross-origin resource sharing (CORS)

### Conclusion

Safari shows multiple attack surfaces in web content processing. Recommended focus areas include JavaScript engine hardening and network request validation.`,
}

/**
 * Get the static list of files
 */
export function getFiles(): string[] {
  return staticFiles
}

/**
 * Analyze a specific file using the FastAPI endpoint
 */
export async function analyzeFile(fileName: string): Promise<{ result: string; traceUrl: string }> {
  try {
    const response = await fetch(`http://localhost:8000/analyze?file=${encodeURIComponent(fileName)}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      result: data.result,
      traceUrl: data.trace_url,
    }
  } catch (error) {
    console.error("Analysis failed:", error)
    throw new Error("Failed to analyze file. Please ensure the analysis server is running on localhost:8000.")
  }
}
