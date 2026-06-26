import React from 'react';
import Swal from 'sweetalert2';
import { HiTrash } from 'react-icons/hi2'; // Assuming you want a trash icon

export default function DeleteButton({ onConfirm, className = "" }) {

    const handleTriggerDelete = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This data will be deleted permanently!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Execute the actual state deletion function passed from parent
                onConfirm();

                // Show success alert
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Data has been deleted successfully.',
                    icon: 'success'
                });
            }
        });
    };

    return (
        <button
            onClick={handleTriggerDelete}
            className={`text-red-600 hover:text-red-900 transition-colors ${className}`}
            title="Delete item"
        >
            <HiTrash className="h-4 w-4" />
        </button>
    );
}