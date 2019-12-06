
export class Message {
    messageText: string;
    user: string;
    messageID: string;
    timestamp: string;

    constructor(messageText: string, user: string, messageID: string, timestamp: string){
        this.messageText = messageText;
        this.user = user;
        this.messageID = messageID;
        this.timestamp = timestamp;
    }
}