import PaymentDetailsTable from '../components/PaymentDetailsTable';
import {  paymentDetails, paymentStats  } from '@/features/payments/services/payment.service';
import { PageHeader } from '@/components/ui';

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
