
export class Message {
    messageText: string;
    user: string;
    displayname: string;
    messageID: string;
    timestamp: string;
    likedBy: string[];
    lovedBy: string[];
    hatedBy: string[];

    constructor(messageText: string, user: string, displayname: string, messageID: string,
         timestamp: string, likedBy, lovedBy, hatedBy) {
        this.messageText = messageText;
        this.user = user;
        this.displayname = displayname;
        this.messageID = messageID;
        this.timestamp = timestamp;
        this.likedBy = likedBy;
        this.lovedBy = lovedBy;
        this.hatedBy = hatedBy;
    }
}