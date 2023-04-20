// contexts/index.tsx
import { ReactNode } from 'react';
import { SocketProvider } from './mysocket.tsx';

const AppContextProviders = ({ children }: { children: ReactNode }) => (
    <SocketProvider>{children}</SocketProvider>
);

export default AppContextProviders;