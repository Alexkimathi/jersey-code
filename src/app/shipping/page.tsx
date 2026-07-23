export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Shipping Information</h1>

        <div className="bg-white p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-semibold mb-6">Delivery Options</h2>

          <div className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="text-lg font-semibold mb-2">Standard Delivery</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• <strong>Nairobi:</strong> 3-5 business days - KES 200</li>
                <li>• <strong>Other areas:</strong> 5-7 business days - KES 300-500</li>
                <li>• Free for orders above KES 5,000</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-600 pl-6">
              <h3 className="text-lg font-semibold mb-2">Express Delivery</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• <strong>Nairobi Only:</strong> Next business day - KES 500</li>
                <li>• Order before 2 PM for next-day delivery</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-600 pl-6">
              <h3 className="text-lg font-semibold mb-2">Pickup</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Free pickup at our locations</li>
                <li>• Ready within 24 hours</li>
                <li>• Locations: Westgate, The Hub Karen, Galleria</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-semibold mb-6">Delivery Areas</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-green-600">✓ Covered Areas</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• All of Nairobi</li>
                <li>• Kiambu</li>
                <li>• Machakos</li>
                <li>• Kajiado</li>
                <li>• Kisii</li>
                <li>• Nakuru</li>
                <li>• Kericho</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Expanding to more areas</h3>
              <p className="text-gray-700 text-sm">
                We're constantly expanding our delivery network. If your area isn't listed, contact us to arrange special delivery or pickup options.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-6">How Tracking Works</h2>
          <ol className="text-gray-700 space-y-4">
            <li className="flex gap-4">
              <span className="text-blue-600 font-bold">1</span>
              <div>
                <strong>Order Confirmed:</strong> You receive SMS confirmation with order number
              </div>
            </li>
            <li className="flex gap-4">
              <span className="text-blue-600 font-bold">2</span>
              <div>
                <strong>Processing:</strong> Our team prepares your order for dispatch
              </div>
            </li>
            <li className="flex gap-4">
              <span className="text-blue-600 font-bold">3</span>
              <div>
                <strong>Ready:</strong> Order is ready for shipment (SMS sent)
              </div>
            </li>
            <li className="flex gap-4">
              <span className="text-blue-600 font-bold">4</span>
              <div>
                <strong>Out for Delivery:</strong> Your package is on the way (SMS + tracking link)
              </div>
            </li>
            <li className="flex gap-4">
              <span className="text-blue-600 font-bold">5</span>
              <div>
                <strong>Delivered:</strong> Order received! Check your inbox for order review request
              </div>
            </li>
          </ol>
          <p className="text-gray-600 mt-6 text-sm">
            You can track your order anytime on our <a href="/orders" className="text-blue-600 hover:underline">Order Tracking page</a>
          </p>
        </div>
      </div>
    </div>
  );
}
