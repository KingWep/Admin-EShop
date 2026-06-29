import PaymentDetailsTable from '../features/payments/PaymentDetailsTable';
import { paymentDetails, paymentStats } from '../api/mockTransactions';
import { PageHeader } from '../components';

export default function PaymentsPage() {
  return (
    <div>
      <PageHeader
        title="Payment Details"
        description="Summary of all payments for the selected period"
        crumbs={[
          { label: "Dashboard", path: "/" },
          { label: "Payment Details" }
        ]}
      />
      <PaymentDetailsTable payments={paymentDetails} stats={paymentStats} />
    </div>
  );
}
