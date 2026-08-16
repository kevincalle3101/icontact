import SectionContainer from '@/components/shared/SectionContainer';
import CartItemRow from '@/components/resumen/CartItemRow';
import OrderSummary from '@/components/resumen/OrderSummary';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  clearCart,
  removeItem,
  selectCartItems,
  selectCartSubtotal,
  updateKitchenObs,
  updateQuantity,
} from '@/store/slices/cartSlice';

interface ResumenSectionProps {
  embedded?: boolean;
}

export default function ResumenSection({ embedded = false }: ResumenSectionProps) {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);

  const handleQuantityChange = (productId: string, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  const handleRemove = (productId: string) => {
    dispatch(removeItem(productId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleUpdateKitchenObs = (productId: string, obs: string) => {
    dispatch(updateKitchenObs({ productId, kitchenObs: obs }));
  };

  const content = (
    <>
      {/* Table header row: Cant. | Producto | Obs. | Precio */}
      <div
        className="mb-[5px] grid gap-[3px] border-b border-[#eef0f8] pb-[5px] text-[9px] font-semibold text-[#bbbbbb]"
        style={{ gridTemplateColumns: '46px 1fr 56px 46px' }}
      >
        <span>Cant.</span>
        <span>Producto</span>
        <span className="text-center">Obs.</span>
        <span className="text-right">Precio</span>
      </div>

      {items.length === 0 ? (
        <p className="py-6 text-center text-[10px] text-slate-400">
          Aún no hay productos en el pedido.
        </p>
      ) : (
        <ul aria-label="Productos en el pedido" className="flex flex-col">
          {items.map((item) => (
            <CartItemRow
              key={item.productId}
              item={item}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
              onUpdateKitchenObs={handleUpdateKitchenObs}
            />
          ))}
        </ul>
      )}

      <OrderSummary
        subtotal={subtotal}
        total={subtotal}
        onClearCart={handleClearCart}
        disabled={items.length === 0}
      />
    </>
  );

  if (embedded) return content;

  return (
    <SectionContainer
      title="4. Resumen Pedido"
      titleClassName="text-[10px] tracking-[0.8px] text-[#8892b0]"
      className="border border-slate-200 bg-white rounded-2xl shadow-xs"
      actions={
        <button
          type="button"
          onClick={handleClearCart}
          disabled={items.length === 0}
          className="text-[14px] text-[#bbbbbb] hover:text-red-600 disabled:opacity-40 transition-colors"
          title="Limpiar carrito"
          aria-label="Limpiar carrito"
        >
          🗑
        </button>
      }
    >
      {content}
    </SectionContainer>
  );
}
