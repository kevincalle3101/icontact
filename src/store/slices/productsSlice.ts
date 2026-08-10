import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchProductsByBrand, fetchSuggestedProducts } from '@/api/productsApi';
import type { Brand, Product, ProductCategory } from '@/types';

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
  /** Currently selected brand */
  activeBrand: Brand;
  /** All products loaded for the active brand */
  allProducts: Product[];
  /** Currently selected category tab */
  activeCategory: ProductCategory;
  /** Suggested / upsell products */
  suggested: Product[];
  /** Current search query typed by the user */
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  activeBrand: 'KFC',
  allProducts: [],
  activeCategory: 'Combos',
  suggested: [],
  searchQuery: '',
  loading: false,
  error: null,
};

// ---------------------------------------------------------------------------
// Async thunks
// ---------------------------------------------------------------------------

/** Load all products for the given brand. Called every time the brand changes. */
export const loadProductsByBrand = createAsyncThunk(
  'products/loadByBrand',
  async (brand: Brand) => {
    const products = await fetchProductsByBrand(brand);
    return products;
  },
);

export const loadSuggestedProducts = createAsyncThunk('products/loadSuggested', async () => {
  return fetchSuggestedProducts();
});

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setActiveBrand(state, action: PayloadAction<Brand>) {
      state.activeBrand = action.payload;
    },
    setActiveCategory(state, action: PayloadAction<ProductCategory>) {
      state.activeCategory = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    clearSearch(state) {
      state.searchQuery = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // ---- loadProductsByBrand ----
      .addCase(loadProductsByBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProductsByBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.allProducts = action.payload;
        // Reset category to first tab when brand changes
        state.activeCategory = 'Combos';
      })
      .addCase(loadProductsByBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error al cargar productos';
      })
      // ---- loadSuggestedProducts ----
      .addCase(loadSuggestedProducts.fulfilled, (state, action) => {
        state.suggested = action.payload;
      });
  },
});

export const { setActiveBrand, setActiveCategory, setSearchQuery, clearSearch } =
  productsSlice.actions;
export default productsSlice.reducer;
