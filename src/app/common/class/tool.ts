export class Tool{
    id : string;
    name: string;
    description: string;
    version?: string;
    path: string;
    recommended?: boolean;
    showLoading: boolean;
    installed: boolean;
  }