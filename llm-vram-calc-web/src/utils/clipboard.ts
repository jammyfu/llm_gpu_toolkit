export const copyToClipboard = async (
  text: string,
  onSuccess: () => void,
  onError: () => void
) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      onSuccess();
      return;
    }

    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      textArea.remove();
      if (successful) {
        onSuccess();
      } else {
        onError();
      }
    } catch (err) {
      textArea.remove();
      onError();
    }
  } catch (err) {
    onError();
  }
}; 