import { createAction } from '@reduxjs/toolkit'



export const updateNftData = createAction<{ name: string, image: string, id: number}[]>('nft/updateNftData');

