import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export default function ViewQuotation() {
  const [quotation, setQuotation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuotation();
  }, [id]);

  const fetchQuotation = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BURL}/quotation/${id}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch quotation');
      const data = await response.json();
      setQuotation(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById(`quotation-${quotation.id}`);
    const opt = {
      margin: 10,
      filename: `quotation-${quotation.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        backgroundColor: '#000000',
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <Loader className="h-8 w-8 animate-spin text-indigo-600" />
    </div>
  );
  
  if (!quotation) return <div className="text-center text-red-600 text-xl mt-8">Quotation not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-00 to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/quotations')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition duration-150 ease-in-out"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Quotations
          </button>
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition duration-150 ease-in-out"
          >
            <Download className="h-5 w-5 mr-2" />
            Download PDF
          </button>
        </div>

        <div id={`quotation-${quotation.id}`} className="bg-white shadow-lg rounded-lg p-8">
          {/* Logo and Header */}
          <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{quotation.businessName}</h1>
                <p className="text-gray-600">{quotation.userAddress}</p>
                <p className="text-gray-600">{quotation.userPhone}</p>
                <p className="text-gray-600">{quotation.userEmail}</p>
              </div>
            <div className="text-right">
              <p className="text-xl font-semibold text-gray-900">Quotation #{quotation.id}</p>
              <p className="text-gray-600">Date: {new Date(quotation.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <img 
              src="/image.png" 
              alt="InvoiceIt" 
              className="w-96 h-auto"
            />
          </div>

          {/* Customer Details */}
          <div className="mb-8 relative">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Bill To:</h2>
            <p className="text-gray-800">{quotation.customerName}</p>
            <p className="text-gray-600">{quotation.customerAddress}</p>
            <p className="text-gray-600">{quotation.customerEmail}</p>
            <p className="text-gray-600">{quotation.customerPhone}</p>
          </div>

          {/* Items Table */}
          <table className="min-w-full mb-8 relative">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quotation.quotationItems.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.productName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₹{item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₹{item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="border-t border-gray-200 pt-4 relative">
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900">₹{quotation.grandTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tax (0%):</span>
                  <span className="text-gray-900">₹0.00</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-800">Total:</span>
                  <span className="text-gray-900">₹{quotation.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="mt-8 border-t border-gray-200 pt-4 relative">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Terms & Conditions</h3>
            <p className="text-gray-600">Please pay within 15 days of receiving this quotation.</p>
          </div>

          {/* Footer with Logo */}
          <div className="mt-8 pt-4 border-t border-gray-200 text-center">
            <img 
              src="/image.png" 
              alt="InvoiceIt Logo" 
              className="h-8 w-auto mx-auto mb-2"
            />
            <p className="text-sm text-gray-500">Generated using InvoiceIt</p>
          </div>
        </div>
      </div>
    </div>
  );
}

