interface Refresh {
    code: number;
    message: string;
    ttl: number;
    data: {
      refresh: boolean;
      timestamp: number;
    };
  }
  