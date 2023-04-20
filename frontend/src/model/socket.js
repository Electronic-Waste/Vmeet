import io from 'socket.io-client';
import {serverurl} from "../utils/ajax";

const socket = io(serverurl);

export default socket;