import PaymentDetailsTable from '../features/payments/PaymentDetailsTable';
import { paymentDetails, paymentStats } from '../api/mockTransactions';

export default function PaymentsPage() {
  return (
    <div>
      {/* Page title */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-900">Payment Details</h1>
      </div>

      <PaymentDetailsTable payments={paymentDetails} stats={paymentStats} />
    </div>
  );
}
