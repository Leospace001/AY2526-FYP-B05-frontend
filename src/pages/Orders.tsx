import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

// 1. Define the shape of your expected response data
interface OrderResponse {
    id: number;
    remarks?: string;
    createdAt?: string;
    // Add any other fields your OrderResponse DTO contains (e.g., createdBy, status)
}

interface PageData {
    content: OrderResponse[];
    totalPages: number;
    totalElements: number;
    number: number; // Current page (0-indexed)
}

export default function Orders() {
    const [data, setData] = useState<PageData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    
    // Track the current page in React state (Spring pages start at 0)
    const [currentPage, setCurrentPage] = useState<number>(0);
    const pageSize = 10;

    // 2. Fetch data whenever the currentPage changes
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/api/order/page?page=${currentPage}&size=${pageSize}`);
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
                // alert("Failed to load orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [currentPage]);

    // 3. Handlers for pagination buttons
    const handleNextPage = () => {
        if (data && currentPage < data.totalPages - 1) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    return (
        <div>
            <h2>Order Management</h2>
            <p>View and manage all customer orders here.</p>

            {loading ? (
                <p>Loading orders...</p>
            ) : (
                <>
                    {/* The Data Table */}
                    <table style={tableStyle}>
                        <thead>
                            <tr style={{ backgroundColor: '#ecf0f1', textAlign: 'left' }}>
                                <th style={thTdStyle}>Order ID</th>
                                <th style={thTdStyle}>Remarks</th>
                                <th style={thTdStyle}>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.content.length === 0 ? (
                                <tr>
                                    <td colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                data?.content.map((order) => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={thTdStyle}>{order.id}</td>
                                        <td style={thTdStyle}>{order.remarks || 'N/A'}</td>
                                        <td style={thTdStyle}>
                                            {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                        <div>
                            Showing page {data ? data.number + 1 : 0} of {data?.totalPages || 0} 
                            {' '}(Total: {data?.totalElements || 0} orders)
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                onClick={handlePrevPage} 
                                disabled={currentPage === 0}
                                style={buttonStyle}
                            >
                                Previous
                            </button>
                            <button 
                                onClick={handleNextPage} 
                                disabled={!data || currentPage >= data.totalPages - 1}
                                style={buttonStyle}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// Simple styles for the table and buttons
const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
};

const thTdStyle: React.CSSProperties = {
    padding: '12px 15px',
    borderBottom: '1px solid #ddd'
};

const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
};