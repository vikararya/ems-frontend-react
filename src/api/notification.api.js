import axios from "./axios";

export const getNotifications = () => axios.get("/notifications");
