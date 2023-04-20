// contexts/socket.tsx
import { createContext, ReactNode, useContext } from 'react';
import io, { Socket } from 'socket.io-client';


const SOCKET_URL = 'wss://vmeet.top:8081';
// const SOCKET_URL = `ws://localhost:8081`;

export const socket = io(SOCKET_URL, {
    transports: ['websocket'],
});

const SocketContext = createContext<Socket>(socket);
SocketContext.displayName = 'SocketContext';

export const SocketProvider = ({ children }: { children: ReactNode }) => (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
);

export const useSocket = () => {
    const context = useContext(SocketContext);
    return context;
};
