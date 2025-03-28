import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import quizReducer from "./features/quizSlice";
import scoreReducer from "./features/scoreSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizReducer,
    score: scoreReducer,
  },
});
