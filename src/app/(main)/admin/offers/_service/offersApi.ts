import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '../../../../../service/baseQuery'

// ── Types ────────────────────────────────────────────────────

export interface ProductOffer {
  productId: number
  offerId: number
  product: {
    id: number
    name: string
    slug: string
    images: { url: string; altText: string | null; isPrimary: boolean }[]
  }
}

export interface Offer {
  id: number
  name?: string | null
  description?: string | null
  discountPercentage?: number | null
  discountFixed?: number | null
  startsAt: string
  endsAt: string
  isActive: boolean
  createdAt: string
  products: ProductOffer[] // was: product + productId
}

interface OffersResponse {
  success: boolean
  activeOffers: Offer[]
  inactiveOffers: Offer[] // was: unactiveOffers
}

interface SingleOfferResponse {
  success: boolean
  offer: Offer
}

// ── Request body types ───────────────────────────────────────

type CreateOfferBody = {
  name?: string
  description?: string
  discountPercentage?: number
  discountFixed?: number
  startsAt: string
  endsAt: string
  isActive?: boolean
  // No productIds — products are added separately after creation
}

type UpdateOfferBody = {
  name?: string
  description?: string
  discountPercentage?: number
  discountFixed?: number
  startsAt?: string
  endsAt?: string
  isActive?: boolean
}

type ProductIdsBody = {
  productIds: number[]
}

// ── API ──────────────────────────────────────────────────────

export const offersApi = createApi({
  reducerPath: 'offersApi',
  baseQuery,
  tagTypes: ['Offer'],
  endpoints: (builder) => ({

    // GET /offers
    getOffers: builder.query<OffersResponse, void>({
      query: () => ({ url: '/offers', method: 'GET' }),
      providesTags: ['Offer'],
    }),

    // GET /offers/:id
    getOffer: builder.query<SingleOfferResponse, number>({
      query: (id) => ({ url: `/offers/${id}`, method: 'GET' }),
      providesTags: (_result, _error, id) => [{ type: 'Offer', id }],
    }),

    // GET /products/:productId/offers
    getOffersByProduct: builder.query<{ success: boolean; offers: Offer[] }, number>({
      query: (productId) => ({ url: `/products/${productId}/offers`, method: 'GET' }),
      providesTags: (_result, _error, productId) => [{ type: 'Offer', id: productId }],
    }),

    // POST /offers
    createOffer: builder.mutation<SingleOfferResponse, CreateOfferBody>({
      query: (body) => ({ url: '/offers', method: 'POST', body }),
      invalidatesTags: ['Offer'],
    }),

    // PUT /offers/:id
    updateOffer: builder.mutation<SingleOfferResponse, { id: number } & UpdateOfferBody>({
      query: ({ id, ...body }) => ({ url: `/offers/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _error, { id }) => ['Offer', { type: 'Offer', id }],
    }),

    // POST /offers/:id/products
    addProductsToOffer: builder.mutation<SingleOfferResponse, { id: number } & ProductIdsBody>({
      query: ({ id, ...body }) => ({ url: `/offers/${id}/products`, method: 'POST', body }),
      invalidatesTags: (_result, _error, { id }) => ['Offer', { type: 'Offer', id }],
    }),

    // DELETE /offers/:id/products
    removeProductsFromOffer: builder.mutation<SingleOfferResponse, { id: number } & ProductIdsBody>({
      query: ({ id, ...body }) => ({ url: `/offers/${id}/products`, method: 'DELETE', body }),
      invalidatesTags: (_result, _error, { id }) => ['Offer', { type: 'Offer', id }],
    }),

    // DELETE /offers/:id
    deleteOffer: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({ url: `/offers/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Offer'],
    }),
  }),
})

export const {
  useGetOffersQuery,
  useGetOfferQuery,
  useGetOffersByProductQuery,
  useCreateOfferMutation,
  useUpdateOfferMutation,
  useAddProductsToOfferMutation,
  useRemoveProductsFromOfferMutation,
  useDeleteOfferMutation,
} = offersApi