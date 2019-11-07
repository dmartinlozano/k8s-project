export interface Software {
    "id": string;
    "name": string;
    "description": string;
    "installed": boolean;
    "installation": {
      "linux": string[],
      "windows": string[]
    }
  }
  