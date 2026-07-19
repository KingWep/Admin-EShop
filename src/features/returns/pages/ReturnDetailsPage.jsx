import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '@/components/layouts/PageContainer';
import { PageHeader } from '@/components/ui';
import Button from '@/components/ui/Button';
import { HiOutlineCheckCircle, HiOutlineXCircle, HiCheck } from 'react-icons/hi2';
import { cn } from '@/utils/cn';
import Swal from 'sweetalert2';
import { useReturnDetails } from '../hooks/useReturnDetails';
import returnService from '../services/return.service';

export default function ReturnDetailsPage() {
  const { id } = useParams();
  
  const { data, loading, error, refetch } = useReturnDetails(id);
  const [actionLoading, setActionLoading] = useState(false);

  const status = (data?.status || 'PENDING').toUpperCase();

  // API handlers
  const handleApprove = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await returnService.approve(id);
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        icon: 'success',
        title: 'Return approved successfully',
      });
      await refetch();
    } catch (err) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        icon: 'error',
        title: err?.response?.data?.message || err.message || 'Failed to approve return',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (actionLoading) return;
    const result = await Swal.fire({
      title: 'Reject Return?',
      text: "Are you sure you want to reject this return?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, reject it'
    });
    if (!result.isConfirmed) return;
    
    setActionLoading(true);
    try {
      await returnService.reject(id);
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        icon: 'success',
        title: 'Return rejected successfully',
      });
      await refetch();
    } catch (err) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        icon: 'error',
        title: err?.response?.data?.message || err.message || 'Failed to reject return',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReceive = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await returnService.receive(id);
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        icon: 'success',
        title: 'Return marked as received',
      });
      await refetch();
    } catch (err) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        icon: 'error',
        title: err?.response?.data?.message || err.message || 'Failed to mark as received',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartInspection = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await returnService.startInspection(id);
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        icon: 'success',
        title: 'Inspection started',
      });
      await refetch();
    } catch (err) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        icon: 'error',
        title: err?.response?.data?.message || err.message || 'Failed to start inspection',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handlePassInspection = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await returnService.completeInspection(id);
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        icon: 'success',
        title: 'Inspection passed',
      });
      await refetch();
    } catch (err) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        icon: 'error',
        title: err?.response?.data?.message || err.message || 'Failed to complete inspection',
      });
    } finally {
      setActionLoading(false);
    }
  };
  
  // Define Steps
  const stepIds = ['REQUESTED', 'APPROVED', 'RECEIVED', 'INSPECTING', 'COMPLETED'];
  
  const isRequested = status === 'REQUESTED' || status === 'PENDING';
  const isApproved = status === 'APPROVED';
  const isReceived = status === 'RECEIVED' || status === 'PENDING_INSPECTION';
  const isInspecting = status === 'INSPECTING' || status === 'IN_PROGRESS';
  const isCompleted = status === 'COMPLETED';
  const isRejected = status === 'REJECTED';

  let currentStepStatus = 'REQUESTED';
  if (isApproved) currentStepStatus = 'APPROVED';
  if (isReceived) currentStepStatus = 'RECEIVED';
  if (isInspecting) currentStepStatus = 'INSPECTING';
  if (isCompleted) currentStepStatus = 'COMPLETED';

  const currentIndex = isRejected ? -1 : stepIds.indexOf(currentStepStatus);

  const displayStatus = (data?.status || 'Unknown')
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

  let pillClass = "bg-slate-100 text-slate-700";
  if (isRequested) pillClass = "bg-amber-100 text-amber-700";
  if (isApproved || isReceived || isInspecting) pillClass = "bg-blue-100 text-blue-700";
  if (isCompleted) pillClass = "bg-emerald-100 text-emerald-700";
  if (isRejected) pillClass = "bg-red-100 text-red-700";

  let currentStatusPill = (
    <span className={`${pillClass} text-[12px] font-bold px-2.5 py-0.5 rounded-full`}>
      {displayStatus}
    </span>
  );

  let refundStatusPill = <span className="font-semibold text-slate-900 text-[13px]">Not created yet</span>;
  if (isCompleted) refundStatusPill = <span className="bg-amber-100 text-amber-700 text-[12px] font-bold px-2.5 py-0.5 rounded-full">Pending</span>;

  const customerName = data?.customer_name || data?.requested_by || 'Unknown';
  const customerEmail = data?.customer_email || 'No email provided';

  const timeline = [
    { status: 'Return Requested', date: data?.requested_at ? new Date(data.requested_at).toLocaleDateString() : '---', author: customerName, color: 'yellow' }
  ];
  if (currentIndex >= 1) timeline.unshift({ status: 'Return Approved', date: data?.approved_at ? new Date(data.approved_at).toLocaleDateString() : '---', author: data?.approved_by || 'Admin', color: 'green' });
  if (currentIndex >= 2) timeline.unshift({ status: 'Item Received', date: '---', author: 'Warehouse Scan', color: 'blue' });
  if (currentIndex >= 3) timeline.unshift({ status: 'Inspection Started', date: '---', author: 'Warehouse Staff', color: 'blue' });
  if (currentIndex >= 4) {
    timeline.shift(); 
    timeline.unshift(
      { status: 'Refund/Replacement Processed', date: data?.completed_at ? new Date(data.completed_at).toLocaleDateString() : '---', author: 'Automatic', color: 'green' },
      { status: 'Inventory Adjusted', date: '---', author: 'Automatic', color: 'green' },
      { status: 'Return Completed', date: data?.completed_at ? new Date(data.completed_at).toLocaleDateString() : '---', author: 'Inspection Passed', color: 'green' },
      { status: 'Item Received', date: '---', author: 'Warehouse Scan', color: 'blue' }
    );
  }
  if (isRejected) {
    timeline.unshift({ status: 'Return Rejected', date: data?.rejected_at ? new Date(data.rejected_at).toLocaleDateString() : '---', author: data?.rejected_by || 'Admin', color: 'red' });
  }

  const Stepper = () => {
    return (
      <div className="w-full bg-white px-8 py-7 rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] mb-6">
        <div className="flex items-center justify-between relative px-4">
          <div className="absolute top-3 left-4 right-4 h-[2px] bg-slate-100 z-0"></div>
          
          {currentIndex >= 0 && (
            <div 
              className="absolute top-3 left-4 h-[2px] bg-green-500 z-0 transition-all duration-500"
              style={{ width: `calc(${(currentIndex / (stepIds.length - 1)) * 100}% - ${currentIndex === 0 ? 0 : (currentIndex === stepIds.length - 1 ? 2 : 1)}rem)` }}
            ></div>
          )}

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
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-64 text-slate-500">Loading return details...</div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-64 text-red-500">{error}</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Return Details"
        crumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Returns', path: '/dashboard/returns' },
          { label: data?.return_id || 'Return Details' }
        ]}
      />

      <Stepper />

      {/* Top Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-[14px] font-semibold text-slate-500">Return ID: {data?.return_id || id}</h3>
            {currentStatusPill}
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1.5 tracking-tight">
            ${data?.amount?.toFixed(2) || '0.00'}
          </div>
          <p className="text-[13px] text-slate-500 font-medium">
            {isRequested ? 'Awaiting approval decision' : 
             isApproved ? 'Waiting for customer to ship the item back' :
             isReceived ? 'Refund not yet created — pending inspection' :
             isInspecting ? 'Inspector reviewing item condition' :
             isCompleted ? 'Refund/Replacement process initiated' :
             'Return was rejected'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-center">
          <h3 className="text-[14.5px] font-semibold text-slate-900 mb-4">Customer Details</h3>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-sm">
              {customerName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-slate-900 text-[13.5px]">{customerName}</div>
              <div className="text-[13px] text-slate-500">{customerEmail}</div>
            </div>
          </div>
          <Link to="#" className="text-[13px] font-medium text-blue-600 hover:text-blue-700">View Customer Profile ↗</Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-center">
          <h3 className="text-[14.5px] font-semibold text-slate-900 mb-4">Associated Order & Product</h3>
          <div className="text-[13.5px] text-slate-800 space-y-2.5 font-medium">
            <div className="flex justify-between"><span className="text-slate-500 font-normal">Order ID:</span> {data?.order_no || 'N/A'}</div>
            <div className="flex justify-between"><span className="text-slate-500 font-normal">Product:</span> <span className="text-right max-w-[120px] truncate" title={data?.product_name}>{data?.product_name || 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500 font-normal">Return Type:</span> {data?.return_type || 'Refund'}</div>
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
                <span className="font-medium text-slate-900 text-right max-w-[150px] truncate">{data?.reason || 'N/A'}</span>
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
                <span className="font-medium text-slate-900">{data?.return_type || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden p-5 pt-4">
            <h3 className="text-[14.5px] font-semibold text-slate-900 mb-4">Action Panel</h3>
            
            {isRequested && (
              <>
                <div className="flex gap-3 mb-3">
                  <Button disabled={actionLoading} onClick={handleApprove} className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-sm font-semibold text-[13px] py-2.5 rounded-lg">
                    {actionLoading ? 'Processing...' : 'Approve Return'}
                  </Button>
                  <Button disabled={actionLoading} onClick={handleReject} className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-sm font-semibold text-[13px] py-2.5 rounded-lg">
                    {actionLoading ? 'Processing...' : 'Reject Return'}
                  </Button>
                </div>
                <p className="text-[12.5px] text-slate-500">Decide whether this return qualifies before the customer ships anything back.</p>
              </>
            )}

            {isApproved && (
              <>
                <Button disabled={actionLoading} onClick={handleReceive} className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-semibold text-[13px] py-2.5 rounded-lg mb-2">
                  {actionLoading ? 'Processing...' : 'Mark as Received'}
                </Button>
                <p className="text-[12.5px] text-slate-500">Log this once the item physically arrives at the warehouse.</p>
              </>
            )}

            {isReceived && (
              <>
                <Button disabled={actionLoading} onClick={handleStartInspection} className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-semibold text-[13px] py-2.5 rounded-lg mb-2">
                  {actionLoading ? 'Processing...' : 'Start Inspection'}
                </Button>
                <p className="text-[12.5px] text-slate-500">Next step: mark inspection as <span className="font-semibold text-slate-800">Passed</span> or <span className="font-semibold text-slate-800">Failed</span>.</p>
              </>
            )}

            {isInspecting && (
              <>
                <div className="flex gap-3 mb-3">
                  <Button disabled={actionLoading} onClick={handlePassInspection} className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-sm font-semibold text-[13px] py-2.5 rounded-lg">
                    {actionLoading ? 'Processing...' : 'Mark Passed'}
                  </Button>
                  <Button disabled={actionLoading} onClick={handleReject} className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-sm font-semibold text-[13px] py-2.5 rounded-lg">
                    {actionLoading ? 'Processing...' : 'Mark Failed'}
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
                    <p className="text-[12px] text-green-800/80">Refund and inventory processes are complete or pending external settlement.</p>
                  </div>
                </div>
              </div>
            )}
            
            {isRejected && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                <div className="flex gap-3 mb-2">
                  <div className="text-red-600 mt-0.5"><HiOutlineXCircle className="w-5 h-5 text-red-600" /></div>
                  <div>
                    <h4 className="text-[13.5px] font-bold text-red-900 mb-1">Return Rejected</h4>
                    <p className="text-[12px] text-red-800/80">The return request was rejected.</p>
                  </div>
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
                    <th className="px-5 py-3 text-right font-semibold">Refund Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center text-slate-400">P</div>
                        <div>
                          <div className="font-semibold text-[13.5px] text-slate-900">{data?.product_name || 'Product Name'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right text-[13.5px] text-slate-900 font-semibold">${data?.amount?.toFixed(2) || '0.00'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="p-5 flex justify-end">
              <div className="w-72 space-y-2.5 text-[13.5px] font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="text-slate-900">${data?.amount?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between pb-3">
                  <span className="text-slate-500">Shipping / Fees</span>
                  <span className="text-slate-900">$0.00</span>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-[14.5px]">
                    {isCompleted ? 'Total Refunded' : isInspecting ? 'Total (pending result)' : 'Total (if completed)'}
                  </span>
                  <span className="font-bold text-slate-900 text-[14.5px]">${data?.amount?.toFixed(2) || '0.00'}</span>
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
                      <div className="text-[12.5px] text-slate-500">by {event.author}</div>
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
