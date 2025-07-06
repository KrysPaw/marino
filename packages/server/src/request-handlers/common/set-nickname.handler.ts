import { app } from "../../app";

app.setRequestHandler('SET_NICKNAME', ({ client, payload }) => {
  const { nickname } = payload;

  // Update client nickname
  client.nickname = nickname;
})