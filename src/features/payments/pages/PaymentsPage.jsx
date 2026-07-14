import PaymentDetailsTable from '../components/PaymentDetailsTable';
import {  paymentDetails, paymentStats  } from '@/features/payments/services/payment.service';
import { PageHeader } from '@/components/ui';
import PageContainer from '@/components/layouts/PageContainer';


export default function PaymentsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Payment Details"
        description="Summary of all payments for the selected period"
        crumbs={[
          { label: "Dashboard", path: "/" },
          { label: "Payment Details" }
        ]}
      />
      <PaymentDetailsTable payments={paymentDetails} stats={paymentStats} />
    </PageContainer>
  );
}
