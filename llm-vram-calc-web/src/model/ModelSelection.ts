import type { Config } from "../types/modelTypes";

export class ModelSelection {
  private configUrl: string;

  constructor(configUrl: string) {
    this.configUrl = configUrl;
  }

  async loadConfig(): Promise<Config> {
    try {
      const response = await fetch(this.configUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Config = await response.json();
      return data;
    } catch (error) {
      throw new Error(`Failed to load config: ${error}`);
    }
  }
} 