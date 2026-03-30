import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '../../../../../service/baseQuery'

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
}

interface CategoryResponse {
  success: boolean
  categories: Category[]
  total: number
}

interface SingleCategoryResponse {
  success: boolean
  category: Category
}

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery,
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryResponse, { page?: number; limit?: number }>({
      query: (params = {}) => ({ url: '/categories', method: 'GET', params }),
      providesTags: ['Category'],
    }),

    createCategory: builder.mutation<SingleCategoryResponse, Partial<Category>>({
      query: (body) => ({ url: '/categories', method: 'POST', body }),
      invalidatesTags: ['Category'],
    }),

    updateCategory: builder.mutation<SingleCategoryResponse, { id: number } & Partial<Category>>({
      query: ({ id, ...body }) => ({ url: `/categories/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Category'],
    }),

    deleteCategory: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({ url: `/categories/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Category'],
    }),

  }),
})

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi