import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '@/components/layouts/PageContainer';
import { PageHeader } from '@/components/ui';
import Button from '@/components/ui/Button';
import { HiOutlineCheckCircle, HiOutlineXCircle, HiCheck } from 'react-icons/hi2';
import { cn } from '@/utils/cn';

export default function ReturnDetailsPage() {
  const { id } = useParams();
  
  // State: 'REQUESTED', 'APPROVED', 'RECEIVED', 'INSPECTING', 'COMPLETED'
  const [status, setStatus] = useState('REQUESTED');

  const handleApprove = () => setStatus('APPROVED');
  const handleReceive = () => setStatus('RECEIVED');
  const handleStartInspection = () => setStatus('INSPECTING');
  const handlePassInspection = () => setStatus('COMPLETED');
  
  // Define Steps
  const stepIds = ['REQUESTED', 'APPROVED', 'RECEIVED', 'INSPECTING', 'COMPLETED'];
  const currentIndex = stepIds.indexOf(status);

  // Dynamic values based on status
  const isRequested = status === 'REQUESTED';
  const isApproved = status === 'APPROVED';
  const isReceived = status === 'RECEIVED';
  const isInspecting = status === 'INSPECTING';
  const isCompleted = status === 'COMPLETED';

  let currentStatusPill = (
    <span className="bg-amber-100 text-amber-700 text-[12px] font-bold px-2.5 py-0.5 rounded-full">Requested</span>
  );
  if (isApproved) currentStatusPill = <span className="bg-blue-100 text-blue-700 text-[12px] font-bold px-2.5 py-0.5 rounded-full">Approved</span>;
  if (isReceived) currentStatusPill = <span className="bg-blue-100 text-blue-700 text-[12px] font-bold px-2.5 py-0.5 rounded-full">Received</span>;
  if (isInspecting) currentStatusPill = <span className="bg-blue-100 text-blue-700 text-[12px] font-bold px-2.5 py-0.5 rounded-full">Inspecting</span>;
  if (isCompleted) currentStatusPill = <span className="bg-emerald-100 text-emerald-700 text-[12px] font-bold px-2.5 py-0.5 rounded-full">Completed</span>;

  let refundStatusPill = <span className="font-semibold text-slate-900 text-[13px]">Not created yet</span>;
  if (isCompleted) refundStatusPill = <span className="bg-amber-100 text-amber-700 text-[12px] font-bold px-2.5 py-0.5 rounded-full">Pending</span>;

  const timeline = [
    { status: 'Return Requested', date: 'Jun 12, 2026, 10:05 AM', author: 'Customer', color: 'yellow' }
  ];
  if (currentIndex >= 1) timeline.unshift({ status: 'Return Approved', date: 'Jun 12, 2026, 2:45 PM', author: 'John Admin', color: 'green' });
  if (currentIndex >= 2) timeline.unshift({ status: 'Item Received', date: 'Jun 14, 2026, 9:12 AM', author: 'Warehouse Scan', color: 'blue' });
  if (currentIndex >= 3) timeline.unshift({ status: 'Inspection Started', date: 'Jun 14, 2026, 1:00 PM', author: 'Warehouse Staff', color: 'blue' });
  if (currentIndex >= 4) {
    timeline.shift(); // Remove inspection started
    timeline.unshift(
      { status: 'Refund Created (Pending)', date: 'Jun 14, 2026, 3:30 PM', author: 'Automatic', color: 'green' },
      { status: 'Inventory Increased +1', date: 'Jun 14, 2026, 3:30 PM', author: 'Automatic', color: 'green' },
      { status: 'Return Completed', date: 'Jun 14, 2026, 3:30 PM', author: 'Inspection Passed', color: 'green' },
      { status: 'Item Received', date: 'Jun 14, 2026, 9:12 AM', author: 'Warehouse Scan', color: 'blue' }
    );
  }

  const Stepper = () => {
    return (
      <div className="w-full bg-white px-8 py-7 rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] mb-6">
        <div className="flex items-center justify-between relative px-4">
          {/* Background Line */}
          <div className="absolute top-3 left-4 right-4 h-[2px] bg-slate-100 z-0"></div>
          
          {/* Progress Line */}
          <div 
            className="absolute top-3 left-4 h-[2px] bg-green-500 z-0 transition-all duration-500"
            style={{ width: `calc(${(currentIndex / (stepIds.length - 1)) * 100}% - ${currentIndex === 0 ? 0 : (currentIndex === stepIds.length - 1 ? 2 : 1)}rem)` }}
          ></div>

          {stepIds.map((step, idx) => {
            const isCompletedStep = idx <= currentIndex && (idx < currentIndex || isCompleted);
            const isCurrentStep = idx === currentIndex && !isCompleted;
            const isPendingStep = idx > currentIndex;

            return (
              <div key={step} className="relative z-10 flex flex-col items-center w-24">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-white border-[2px] transition-colors duration-300",
                  isCompletedStep ? "bg-green-500 border-green-500" :
                  isCurrentStep ? "bg-white border-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.1)]" :
                  "bg-white border-slate-200"
                )}>
                  {isCompletedStep ? (
                    <HiCheck className="w-4 h-4" />
                  ) : isCurrentStep ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                  ) : null}
                </div>
                <div className="flex flex-col items-center mt-3">
                  <span className={cn(
                    "text-[11px] font-bold tracking-wider",
                    isCompletedStep ? "text-green-600" : 
                    isCurrentStep ? "text-blue-600" : "text-slate-400"
                  )}>
                    {step}
                  </span>
                  <div className="h-4 mt-1">
                    {idx === 0 && <span className="text-[10.5px] text-slate-400">Jun 12, 10:05 AM</span>}
                    {idx === 1 && isCompletedStep && <span className="text-[10.5px] text-slate-400">Jun 12, 2:45 PM</span>}
                    {idx === 1 && isCurrentStep && <span className="text-[10.5px] text-slate-400">Jun 12, 2:45 PM</span>}
                    {idx === 2 && (idx <= currentIndex && !isRequested && !isApproved) && <span className="text-[10.5px] text-slate-400">Jun 14, 9:12 AM</span>}
                    {idx === 2 && isCurrentStep && <span className="text-[10.5px] text-slate-400">Awaiting item</span>}
                    {idx === 3 && (idx === currentIndex && isInspecting) && <span className="text-[10.5px] text-slate-400">In progress</span>}
                    {idx === 3 && (isCompleted) && <span className="text-[10.5px] text-slate-400">Passed</span>}
                    {idx === 3 && isPendingStep && !isCompleted && !isInspecting && <span className="text-[10.5px] text-slate-200">—</span>}
                    {idx === 4 && isCompletedStep && <span className="text-[10.5px] text-slate-400">Jun 14, 3:30 PM</span>}
                    {idx === 4 && !isCompletedStep && <span className="text-[10.5px] text-slate-200">—</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Helper text shown on Inspecting step */}
        {isInspecting && (
          <div className="flex justify-end mt-4 text-[10.5px] text-slate-400 mr-2">
            Passed &rarr; <span className="text-green-600 font-bold mx-1">COMPLETED</span> + Refund created &nbsp;&nbsp;&nbsp; Failed &rarr; <span className="text-red-600 font-bold ml-1">REJECTED</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <PageContainer>
      <PageHeader
        title="Return Details"
        crumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Returns', path: '/dashboard/returns' },
          { label: 'Return Details' }
        ]}
      />

      <Stepper />

      {/* Top Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-[14px] font-semibold text-slate-500">Refund ID: RET-001</h3>
            {currentStatusPill}
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1.5 tracking-tight">
            $1,349.98
          </div>
          <p className="text-[13px] text-slate-500 font-medium">
            {isRequested ? 'Awaiting approval decision' : 
             isApproved ? 'Waiting for customer to ship the item back' :
             isReceived ? 'Refund not yet created — pending inspection' :
             isInspecting ? 'Inspector reviewing item condition' :
             'Refunded to Credit Card ****1234'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-center">
          <h3 className="text-[14.5px] font-semibold text-slate-900 mb-4">Customer Details</h3>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-sm">
              EC
            </div>
            <div>
              <div className="font-semibold text-slate-900 text-[13.5px]">Emily Chen</div>
              <div className="text-[13px] text-slate-500">emily.chen@email.com</div>
            </div>
          </div>
          <Link to="#" className="text-[13px] font-medium text-blue-600 hover:text-blue-700">View Customer Profile ↗</Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-center">
          <h3 className="text-[14.5px] font-semibold text-slate-900 mb-4">Associated Order</h3>
          <div className="text-[13.5px] text-slate-800 space-y-2.5 font-medium">
            <div className="flex justify-between"><span className="text-slate-500 font-normal">Order ID:</span> #ORD-1001</div>
            <div className="flex justify-between"><span className="text-slate-500 font-normal">Order Date:</span> Jun 10, 2026</div>
            <div className="flex justify-between"><span className="text-slate-500 font-normal">Order Total:</span> $1,349.98</div>
          </div>
        </div>
      </div>

      {/* Main Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-[14.5px] font-semibold text-slate-900">Return Information</h3>
            </div>
            <div className="p-5 space-y-4 text-[13.5px]">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Return Reason</span>
                <span className="font-medium text-slate-900">Defective Product</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Current Status</span>
                {currentStatusPill}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Refund Status</span>
                {refundStatusPill}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Return Type</span>
                <span className="font-medium text-slate-900">Full Refund</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Payment Method</span>
                <span className="font-medium text-slate-900">Visa ending in 1234</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-[14.5px] font-semibold text-slate-900">Payment Details</h3>
            </div>
            <div className="p-5 space-y-4 text-[13.5px]">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Payment Transaction ID</span>
                <span className="font-medium text-slate-900">trn_A182C3D4E5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Refund Transaction ID</span>
                <span className="font-medium text-slate-900">{isCompleted ? 'rf_5G6H7I8J9K' : '—'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden p-5 pt-4">
            <h3 className="text-[14.5px] font-semibold text-slate-900 mb-4">Action Panel</h3>
            
            {isRequested && (
              <>
                <div className="flex gap-3 mb-3">
                  <Button onClick={handleApprove} className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-sm font-semibold text-[13px] py-2.5 rounded-lg">
                    Approve Return
                  </Button>
                  <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-sm font-semibold text-[13px] py-2.5 rounded-lg">
                    Reject Return
                  </Button>
                </div>
                <p className="text-[12.5px] text-slate-500">Decide whether this return qualifies before the customer ships anything back.</p>
              </>
            )}

            {isApproved && (
              <>
                <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-4 flex gap-3">
                  <div className="text-green-600 mt-0.5"><HiCheck className="w-5 h-5 bg-green-600 text-white rounded-full p-0.5" /></div>
                  <div>
                    <h4 className="text-[13.5px] font-bold text-green-900 mb-1">Approved by John Admin</h4>
                    <p className="text-[12px] text-green-800/80">Jun 12, 2026 • 2:45 PM. Return label sent to customer.</p>
                  </div>
                </div>
                <Button onClick={handleReceive} className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-semibold text-[13px] py-2.5 rounded-lg mb-2">
                  Mark as Received
                </Button>
                <p className="text-[12.5px] text-slate-500">Log this once the item physically arrives at the warehouse.</p>
              </>
            )}

            {isReceived && (
              <>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 flex gap-3">
                  <div className="text-blue-600 mt-0.5"><HiCheck className="w-5 h-5 bg-blue-600 text-white rounded-full p-0.5" /></div>
                  <div>
                    <h4 className="text-[13.5px] font-bold text-blue-900 mb-1">Item received in warehouse</h4>
                    <p className="text-[12px] text-blue-800/80">Logged Jun 14, 2026 • 9:12 AM. Start inspection to move this return forward.</p>
                  </div>
                </div>
                <Button onClick={handleStartInspection} className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-semibold text-[13px] py-2.5 rounded-lg mb-2">
                  Start Inspection
                </Button>
                <p className="text-[12.5px] text-slate-500">Next step: mark inspection as <span className="font-semibold text-slate-800">Passed</span> or <span className="font-semibold text-slate-800">Failed</span>.</p>
              </>
            )}

            {isInspecting && (
              <>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 flex gap-3">
                  <div className="text-blue-600 mt-0.5"><HiCheck className="w-5 h-5 bg-blue-600 text-white rounded-full p-0.5" /></div>
                  <div>
                    <h4 className="text-[13.5px] font-bold text-blue-900 mb-1">Inspection in progress</h4>
                    <p className="text-[12px] text-blue-800/80">Started Jun 14, 2026 • 1:00 PM (by Warehouse Staff). Record the result below.</p>
                  </div>
                </div>
                <div className="flex gap-3 mb-3">
                  <Button onClick={handlePassInspection} className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-sm font-semibold text-[13px] py-2.5 rounded-lg">
                    Mark Passed
                  </Button>
                  <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-sm font-semibold text-[13px] py-2.5 rounded-lg">
                    Mark Failed
                  </Button>
                </div>
                <p className="text-[12.5px] text-slate-500">This decision determines whether a refund is created or the return is rejected.</p>
              </>
            )}

            {isCompleted && (
              <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                <div className="flex gap-3 mb-2">
                  <div className="text-green-600 mt-0.5"><HiCheck className="w-5 h-5 bg-green-600 text-white rounded-full p-0.5" /></div>
                  <div>
                    <h4 className="text-[13.5px] font-bold text-green-900 mb-1">Inspection passed — return completed</h4>
                    <p className="text-[12px] text-green-800/80">Jun 14, 2026 • 3:30 PM. Inventory increased by 1 unit and a refund (PENDING) was created automatically.</p>
                  </div>
                </div>
                <div className="border-t border-green-100 pt-3 mt-3">
                  <p className="text-[12px] text-green-800/70">No further action needed here — refund now progresses through the payment provider.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-[14.5px] font-semibold text-slate-900">Items in Return</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px] text-slate-700 font-medium">
                <thead className="bg-white border-b border-slate-100 text-[12px] text-slate-500 font-semibold">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Item</th>
                    <th className="px-5 py-3 text-center font-semibold">Qty</th>
                    <th className="px-5 py-3 text-right font-semibold">Unit Price</th>
                    <th className="px-5 py-3 text-right font-semibold">Refund Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src="https://placehold.co/40x40/f3f4f6/a1a1aa?text=Lamp" alt="Lamp" className="w-10 h-10 rounded-md border border-slate-200 object-cover" />
                        <div>
                          <div className="font-semibold text-[13.5px] text-slate-900">Artisanal Brass & Oak Desk Lamp</div>
                          <div className="text-[12px] text-slate-500 font-normal">SKU: lamp-ch-01</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center text-[13.5px]">1</td>
                    <td className="px-5 py-4 text-right text-[13.5px]">$1,349.98</td>
                    <td className="px-5 py-4 text-right text-[13.5px] text-slate-900 font-semibold">$1,349.98</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="p-5 flex justify-end">
              <div className="w-72 space-y-2.5 text-[13.5px] font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="text-slate-900">$1,349.98</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Shipping</span>
                  <span className="text-slate-900">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tax</span>
                  <span className="text-slate-900">$0.00</span>
                </div>
                <div className="flex justify-between pb-3">
                  <span className="text-slate-500">Discount</span>
                  <span className="text-slate-900">$0.00</span>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-[14.5px]">
                    {isCompleted ? 'Total Refunded' : isInspecting ? 'Total (pending result)' : 'Total (if completed)'}
                  </span>
                  <span className="font-bold text-slate-900 text-[14.5px]">$1,349.98</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-[14.5px] font-semibold text-slate-900">Return Timeline</h3>
            </div>
            <div className="p-6">
              <div className="space-y-0 relative">
                {timeline.map((event, idx) => (
                  <div key={idx} className="flex gap-4 relative">
                    <div className="flex flex-col items-center relative z-10">
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center mt-0.5",
                        event.color === 'yellow' ? "bg-amber-100" :
                        event.color === 'green' ? "bg-emerald-100" :
                        "bg-blue-100"
                      )}>
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          event.color === 'yellow' ? "bg-amber-500" :
                          event.color === 'green' ? "bg-emerald-500" :
                          "bg-blue-500"
                        )}></div>
                      </div>
                      {idx !== timeline.length - 1 && (
                        <div className="w-[1.5px] bg-slate-100 my-1 absolute top-5 bottom-[-8px]"></div>
                      )}
                    </div>
                    <div className="pb-6 pt-0.5">
                      <div className="text-[13.5px] font-semibold text-slate-900 mb-0.5">{event.status}</div>
                      <div className="text-[12.5px] text-slate-500">{event.date} (by {event.author})</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
