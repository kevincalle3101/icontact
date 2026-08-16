import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchProductsByBrand, fetchSuggestedProducts } from '@/api/productsApi';
import type { Brand, Product, ProductCategory } from '@/types';

/** Category tabs are brand-specific: each brand's menu is organized differently. */
export const BRAND_CATEGORIES: Record<Brand, ProductCategory[]> = {
  KFC: ['Combos', 'Individuales', 'Complementos', 'Postres', 'Bebidas', 'Salsas', 'Desayunos', 'Otros'],
  Chilis: ['Entradas', 'Parrillas', 'Fajitas', 'Hamburguesas', 'Ensaladas', 'Postres', 'Bebidas', 'Otros'],
  'Madam Tusan': ['Dim Sum', 'Wok', 'Arroz Chaufa', 'Sopas', 'Entradas', 'Postres', 'Bebidas', 'Otros'],
  'Pizza Hut': ['Pizzas', 'Pastas', 'Entradas', 'Alitas', 'Postres', 'Bebidas', 'Otros'],
};

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
  activeCategory: BRAND_CATEGORIES.KFC[0],
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
        // Reset category to that brand's first tab when brand changes
        state.activeCategory = BRAND_CATEGORIES[action.meta.arg][0];
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
