export * from "./string";
export * from "./classnames";
export * from "./time";

/**
 * Downloads data as a JSON file to the user's device
 *
 * This function creates a downloadable JSON file from the provided data and
 * automatically triggers the browser's download mechanism. The file will be
 * saved with the specified filename and .json extension.
 *
 * @param data - The data to be downloaded. Can be any serializable JavaScript object
 * @param filename - The name of the file without extension (e.g., "words-export" becomes "words-export.json")
 *
 * @example
 * ```typescript
 * const words = [{ id: 1, word: "hello" }, { id: 2, word: "world" }];
 * downloadJSON(words, "my-words");
 * // Downloads: my-words.json
 * ```
 *
 * @example
 * ```typescript
 * const userData = { name: "John", age: 30 };
 * downloadJSON(userData, "user-profile");
 * // Downloads: user-profile.json
 * ```
 */
export const downloadJSON = (data: any, filename: string): void => {
  // Convert data to formatted JSON string with 2-space indentation
  const jsonString = JSON.stringify(data, null, 2);

  // Create a Blob with JSON content type
  const blob = new Blob([jsonString], { type: "application/json" });

  // Create a temporary URL for the blob
  const url = URL.createObjectURL(blob);

  // Create a temporary link element
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.json`;

  // Append link to DOM, trigger download, and clean up
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the temporary URL to prevent memory leaks
  URL.revokeObjectURL(url);
};
