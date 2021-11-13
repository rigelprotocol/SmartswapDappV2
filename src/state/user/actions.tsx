import { createAction } from '@reduxjs/toolkit'

export const updateUserSlippageTolerance = createAction<{ userSlippageTolerance: number }>(
  'user/updateUserSlippageTolerance',
)

export const updateUserDeadline = createAction<{ userDeadline: number }>('user/updateUserDeadline');
