import { createSlice,type PayloadAction } from '@reduxjs/toolkit'

export interface CartItem {
  id: string
  name: string
  variant: string
  size: string
  price: number
  quantity: number
  image: string
}

interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: [],
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        i => i.id === action.payload.id && i.size === action.payload.size
      )
      if (existing) {
        existing.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
    },
    removeItem: (state, action: PayloadAction<{ id: string; size: string }>) => {
      state.items = state.items.filter(
        i => !(i.id === action.payload.id && i.size === action.payload.size)
      )
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; size: string; quantity: number }>) => {
      const item = state.items.find(
        i => i.id === action.payload.id && i.size === action.payload.size
      )
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(
            i => !(i.id === action.payload.id && i.size === action.payload.size)
          )
        } else {
          item.quantity = action.payload.quantity
        }
      }
    },
    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer