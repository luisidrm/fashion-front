import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from '../../../../service/baseQuery'
import { ProductImages } from "@/components/admin/MultiImagePicker";

interface Pagination {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  hasOffer?: boolean;
  page?: number;
  limit?: number;
}

export type ProductSize = {
  id: number
  sizeId: number
  stock: number
  size: { id: number; name: string }
}

export interface Size {
  id: number;
  name: string;
}

export interface Product {
  id: number
  name: string
  slug: string
  description?: string
  price: number
  stockQuantity: number  // not stock
  isActive: boolean
  categoryId?: number
  category?: { id: number; name: string; slug: string }
  images: ProductImages[]
  sizes: ProductSize[]   // add this
}

export interface Offer {
  id: number;
  productId: number;
  discountPercentage?: number;
  discountFixed?: number;
  startDate: string;
  endDate: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

interface CategoryResponse {
  success: boolean;
  categories: Category[];
}

export interface ProductResponse {
  success: boolean;
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductBySlugResponse {
  success: boolean;
  product: Product;
}

export interface SizeResponse {
  success: boolean;
  sizes: Size[];
}

export const shopApi = createApi({
  reducerPath: 'shopApi',
  tagTypes: ['Product', 'ProductImage', 'Size'],
  baseQuery,
  endpoints: (builder) => ({
    getProducts: builder.query<ProductResponse, Pagination>({
      query: (payload) => ({
        url: '/products',
        method: 'GET',
        params: payload
      }),
      providesTags: ["Product"],
    }),
    getSizes: builder.query<SizeResponse, void>({
      query: () => ({
        url: '/sizes',
        method: 'GET',
      }),
      providesTags: ['Size'],
    }),
    // 2. Get product by slug (public)
    getProductBySlug: builder.query<ProductBySlugResponse, string>({
      query: (slug) => ({
        url: `/products/${slug}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, slug) => [{ type: 'Product', id: slug }],
    }),
    getCategories: builder.query<CategoryResponse, void>({
      query: () => ({
        url: '/categories',
        method: 'GET',
      }),
    }),
    // 3. Create product (admin)
    createProduct: builder.mutation<ProductResponse, Product>({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),  

    // 4. Update product (admin)
    updateProduct: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'Product',
        { type: 'Product', id },
      ],
    }),

    // 5. Deactivate product / soft-delete (admin)
    deactivateProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        'Product',
        { type: 'Product', id },
      ],
    }),

    // 6. Add image to product (admin)
    addProductImage: builder.mutation({
      query: ({ productId, ...body }) => ({
        url: `/products/${productId}/images`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: 'Product', id: productId },
        'ProductImage',
      ],
    }),

    // 7. Delete product image (admin)
    deleteProductImage: builder.mutation({
      query: (imageId) => ({
        url: `/products/images/${imageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ProductImage', 'Product'],
    }),
  }),
})

export const {
  useLazyGetProductsQuery,
  useGetProductsQuery,
  useLazyGetSizesQuery,
  useGetSizesQuery,
  useGetProductBySlugQuery,
  useLazyGetProductBySlugQuery,
  useLazyGetCategoriesQuery,
  useGetCategoriesQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeactivateProductMutation,
  useAddProductImageMutation,
  useDeleteProductImageMutation,
} = shopApi;