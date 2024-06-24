import { io } from 'socket.io-client'

class SocketioService {
    socket;
    constructor() {}
  
    setupSocketConnection() {
      this.socket = io("http://localhost:8090");
    }
  }
  
  export default new SocketioService();