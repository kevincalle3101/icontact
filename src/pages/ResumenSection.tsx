import { toast } from 'react-toastify';
import SectionContainer from '@/components/shared/SectionContainer';
import CartItemRow from '@/components/resumen/CartItemRow';
import OrderSummary from '@/components/resumen/OrderSummary';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  clearCart,
  removeItem,
  selectCartItems,
  selectCartSubtotal,
  updateQuantity,
} from '@/store/slices/cartSlice';

export default function ResumenSection() {
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
    toast.info('Producto eliminado del pedido');
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.info('Pedido cancelado');
  };

  return (
    <SectionContainer title="4. Resumen Pedido" className="h-full">
      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">
          Aún no hay productos en el pedido.
        </p>
      ) : (
        <ul aria-label="Productos en el pedido">
          {items.map((item) => (
            <CartItemRow
              key={item.productId}
              item={item}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onRemove={handleRemove}
            />
          ))}
        </ul>
      )}
      <OrderSummary
        subtotal={subtotal}
        onClearCart={handleClearCart}
        disabled={items.length === 0}
      />
    </SectionContainer>
  );
}
