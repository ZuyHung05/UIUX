export interface Message {
  id: string;
  text: string;
  sender: "bot" | "user";
  timestamp: Date;
}
