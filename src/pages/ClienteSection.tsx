import { useEffect } from 'react';
import { toast } from 'react-toastify';
import SectionContainer from '@/components/shared/SectionContainer';
import Spinner from '@/components/shared/Spinner';
import ErrorMessage from '@/components/shared/ErrorMessage';
import DeliveryType from '@/components/cliente/DeliveryType';
import OrderHistoryTable from '@/components/cliente/OrderHistoryTable';
import CustomerForm, { type CustomerFormValues } from '@/components/cliente/CustomerForm';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  clearCustomerError,
  loadCustomerByPhone,
  saveCustomer,
  setDeliveryChannel,
} from '@/store/slices/customerSlice';
import type { OrderHistoryItem } from '@/types';

export default function ClienteSection() {
  const dispatch = useAppDispatch();
  const { customer, orderHistory, storeInfo, deliveryChannel, loading, error } = useAppSelector(
    (state) => state.customer,
  );

  useEffect(() => {
    dispatch(loadCustomerByPhone('970220065'));
  }, [dispatch]);

  const handleSearch = (phone: string) => {
    dispatch(clearCustomerError());
    dispatch(loadCustomerByPhone(phone));
  };

  const handleSave = (values: CustomerFormValues) => {
    if (!customer) return;
    dispatch(saveCustomer({ id: customer.id, ...values }));
  };

  const handleViewOrder = (order: OrderHistoryItem) => {
    toast.info(`Pedido ${order.time} · S/ ${order.total.toFixed(2)}`);
  };

  return (
    <SectionContainer
      title="1. Cliente"
      className="h-full"
    >
      <div className="flex flex-col gap-4">
        {loading && !customer && <Spinner label="Buscando cliente..." />}
        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => dispatch(loadCustomerByPhone('970220065'))}
          />
        )}
        {!loading || customer ? (
          <CustomerForm
            customer={customer}
            loading={loading}
            onSearch={handleSearch}
            onSave={handleSave}
          />
        ) : null}

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase text-slate-500">Canal de venta</h3>
          <DeliveryType
            value={deliveryChannel}
            onChange={(channel) => dispatch(setDeliveryChannel(channel))}
          />
        </div>

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase text-slate-500">Últimos pedidos</h3>
          <OrderHistoryTable orders={orderHistory} onViewDetails={handleViewOrder} />
        </div>

        <div className="rounded-md bg-slate-50 p-3 text-xs text-slate-500">
          <p className="font-semibold text-slate-600">
            Tienda: {storeInfo.code} - {storeInfo.name}
          </p>
          <p>Direcc.: {storeInfo.address}</p>
        </div>
      </div>
    </SectionContainer>
  );
}
