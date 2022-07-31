import { createAction } from "@reduxjs/toolkit";

export const setChainId = createAction<{ value: number }>(
    "chainId/updateChainId"
);
