declare module '@selfxyz/qrcode' {
    export interface SelfAppBuilderOptions {
      version: number;
      appName: string;
      scope: string;
      endpoint: string;
      logoBase64: string;
      userId: string;
      endpointType: 'production' | 'staging';
      userIdType: string;
      disclosures: {
        minimumAge: number;
        nationality: boolean;
        gender: boolean;
      };
    }
  
    export class SelfAppBuilder {
      constructor(options: SelfAppBuilderOptions);
      build(): any;
    }
  
    export interface SelfQRcodeWrapperProps {
      selfApp: any;
      onSuccess: () => void;
      onError: (error: Error) => void;
      onLoad?: () => void;
    }
  
    export const SelfQRcodeWrapper: React.FC<SelfQRcodeWrapperProps>;
  }