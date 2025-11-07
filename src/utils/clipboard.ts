/**
 * Safe clipboard copy utility that works even when Clipboard API is blocked
 */

export async function safeCopyToClipboard(text: string): Promise<boolean> {
  // Method 1: Try modern Clipboard API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API blocked, using fallback method');
    }
  }

  // Method 2: Fallback - use execCommand (deprecated but works in restricted contexts)
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make it invisible but still accessible
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    textArea.style.opacity = '0';
    textArea.style.pointerEvents = 'none';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    // Try to copy
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (successful) {
      return true;
    }
  } catch (err) {
    console.warn('execCommand copy failed', err);
  }

  // Method 3: Final fallback - create a modal with selectable text
  return false;
}

/**
 * Show a modal with copyable text when clipboard methods fail
 */
export function showCopyModal(text: string, label: string): void {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.3);
    z-index: 10000;
    max-width: 90vw;
    max-height: 80vh;
    overflow: auto;
  `;

  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 9999;
  `;

  const content = `
    <div>
      <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #1f2937;">
        Copy ${label}
      </h3>
      <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280;">
        Select the text below and press Ctrl+C (or Cmd+C on Mac) to copy:
      </p>
      <textarea 
        readonly
        style="
          width: 100%;
          min-height: 200px;
          padding: 12px;
          font-family: monospace;
          font-size: 13px;
          border: 2px solid #3b82f6;
          border-radius: 4px;
          background: #f9fafb;
          resize: vertical;
        "
      >${text}</textarea>
      <button 
        onclick="this.parentElement.parentElement.previousSibling.remove(); this.parentElement.parentElement.remove();"
        style="
          margin-top: 16px;
          padding: 8px 16px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        "
        onmouseover="this.style.background='#2563eb'"
        onmouseout="this.style.background='#3b82f6'"
      >
        Close
      </button>
    </div>
  `;

  modal.innerHTML = content;
  
  overlay.onclick = () => {
    overlay.remove();
    modal.remove();
  };

  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  // Auto-select the textarea
  const textarea = modal.querySelector('textarea');
  if (textarea) {
    textarea.focus();
    textarea.select();
  }
}
