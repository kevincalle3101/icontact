import { FiTrash2 } from 'react-icons/fi';
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

  const handleIncrement = (productId: string) => {
    const item = items.find((i) => i.productId === productId);
    if (item) dispatch(updateQuantity({ productId, quantity: item.quantity + 1 }));
  };

  const handleDecrement = (productId: string) => {
    const item = items.find((i) => i.productId === productId);
    if (item) dispatch(updateQuantity({ productId, quantity: item.quantity - 1 }));
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
      {/* Table header row matching screenshot: Cant. | Producto | Obs. | Precio */}
      <div className="mb-2 flex items-center justify-between border-b border-slate-200 pb-1 text-[10px] font-bold text-slate-400 uppercase">
        <span className="w-8">Cant.</span>
        <span className="flex-1 px-1">Producto</span>
        <span className="w-8 text-center">Obs.</span>
        <span className="w-16 text-right">Precio</span>
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
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
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
      title="4. RESUMEN PEDIDO"
      className="border border-slate-200 bg-white rounded-2xl shadow-xs"
      actions={
        <button
          type="button"
          onClick={handleClearCart}
          disabled={items.length === 0}
          className="text-slate-400 hover:text-red-600 disabled:opacity-40 transition-colors"
          title="Limpiar carrito"
          aria-label="Limpiar carrito"
        >
          <FiTrash2 size={15} />
        </button>
      }
    >
      {content}
    </SectionContainer>
  );
}
