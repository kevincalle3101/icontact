import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchProductsByCategory, fetchSuggestedProducts, searchProducts } from '@/api/productsApi';
import type { Product, ProductCategory } from '@/types';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Combos',
  'Individuales',
  'Complementos',
  'Postres',
  'Bebidas',
  'Salsas',
  'Desayunos',
  'Otros',
];

interface ProductsState {
  activeCategory: ProductCategory;
  itemsByCategory: Partial<Record<ProductCategory, Product[]>>;
  suggested: Product[];
  searchQuery: string;
  searchResults: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  activeCategory: 'Combos',
  itemsByCategory: {},
  suggested: [],
  searchQuery: '',
  searchResults: [],
  loading: false,
  error: null,
};

export const loadProductsByCategory = createAsyncThunk(
  'products/loadByCategory',
  async (category: ProductCategory) => {
    const products = await fetchProductsByCategory(category);
    return { category, products };
  },
);

export const loadSuggestedProducts = createAsyncThunk('products/loadSuggested', async () => {
  return fetchSuggestedProducts();
});

export const runProductSearch = createAsyncThunk('products/search', async (query: string) => {
  const products = await searchProducts(query);
  return { query, products };
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setActiveCategory(state, action: PayloadAction<ProductCategory>) {
      state.activeCategory = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    clearSearch(state) {
      state.searchQuery = '';
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.itemsByCategory[action.payload.category] = action.payload.products;
      })
      .addCase(loadProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error al cargar productos';
      })
      .addCase(loadSuggestedProducts.fulfilled, (state, action) => {
        state.suggested = action.payload;
      })
      .addCase(runProductSearch.pending, (state) => {
        state.loading = true;
      })
      .addCase(runProductSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.products;
      })
      .addCase(runProductSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error al buscar productos';
      });
  },
});

export const { setActiveCategory, setSearchQuery, clearSearch } = productsSlice.actions;
export default productsSlice.reducer;
