export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Returns & Refunds</h1>

        <div className="bg-white p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-semibold mb-6">30-Day Return Policy</h2>
          <p className="text-gray-700 mb-6">
            We want you to be happy with your purchase. If you're not satisfied, we offer a 30-day return policy.
          </p>

          <h3 className="text-lg font-semibold mb-4">Return Conditions</h3>
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <p className="text-gray-700 mb-4">Items must meet ALL of the following conditions:</p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <strong>Unworn and unwashed</strong> - Item must be in original condition
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <strong>Tags attached</strong> - Original care tags and product labels intact
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <strong>Within 30 days</strong> - Return initiated within 30 days of delivery
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <strong>Original packaging</strong> - Package in original or equivalent protection
                </div>
              </li>
            </ul>
          </div>

          <h3 className="text-lg font-semibold mb-4">Non-Returnable Items</h3>
          <ul className="text-gray-700 space-y-2 mb-6">
            <li>• Custom/personalized jerseys (unless defective)</li>
            <li>• Clearance or final sale items</li>
            <li>• Items purchased with promotional codes (unless defective)</li>
            <li>• Swimwear with tags removed</li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-semibold mb-6">How to Return</h2>
          <ol className="space-y-6">
            <li className="flex gap-4">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">1</span>
              <div>
                <strong>Contact Us</strong>
                <p className="text-gray-600 text-sm">
                  Email support@jerseystore.co.ke or call with your order number within 30 days of delivery
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">2</span>
              <div>
                <strong>Get Return Authorization</strong>
                <p className="text-gray-600 text-sm">
                  We'll provide a return address and RMA number
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">3</span>
              <div>
                <strong>Ship It Back</strong>
                <p className="text-gray-600 text-sm">
                  Pack the item securely and send to the address provided. You pay return shipping.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">4</span>
              <div>
                <strong>Inspection</strong>
                <p className="text-gray-600 text-sm">
                  We inspect your return and process within 5 business days
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">5</span>
              <div>
                <strong>Refund Issued</strong>
                <p className="text-gray-600 text-sm">
                  Original payment method refunded. Please allow 3-5 business days for processing
                </p>
              </div>
            </li>
          </ol>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-8 rounded-lg mb-8">
          <h3 className="text-lg font-semibold mb-4">Return Shipping</h3>
          <ul className="text-gray-700 space-y-2">
            <li>• Customer pays return shipping costs</li>
            <li>• We recommend using trackable courier services</li>
            <li>• Keep proof of shipment until refund is confirmed</li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-semibold mb-6">Defective Items</h2>
          <p className="text-gray-700 mb-6">
            If you receive a defective or damaged item, contact us immediately with photos. We'll:
          </p>
          <ul className="text-gray-700 space-y-2">
            <li>• Replace the item at no cost</li>
            <li>• Provide prepaid return label</li>
            <li>• Ship replacement immediately</li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-6">Questions?</h2>
          <p className="text-gray-700 mb-4">
            Contact our support team:
          </p>
          <ul className="text-gray-700">
            <li>Email: support@jerseystore.co.ke</li>
            <li>Phone: +254 712 345 678</li>
            <li>Hours: Mon-Fri 9AM-6PM EAT</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
