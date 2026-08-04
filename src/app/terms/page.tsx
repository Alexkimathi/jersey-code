export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>

        <div className="bg-white p-8 rounded-lg shadow space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">1. General Terms</h2>
            <p className="text-gray-700">
              These terms and conditions constitute the entire agreement between you and Jersey Code (hereinafter "we", "us", "our" or "Company"). By accessing or using our website and placing orders, you agree to be bound by these terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">2. Product Information</h2>
            <ul className="text-gray-700 space-y-2">
              <li>• We strive to provide accurate descriptions and pricing</li>
              <li>• Product images are representative and may vary slightly</li>
              <li>• Prices are subject to change without notice</li>
              <li>• We reserve the right to limit quantities and discontinue products</li>
              <li>• All products are subject to availability</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">3. Order & Payment</h2>
            <ul className="text-gray-700 space-y-2">
              <li>• All orders are subject to acceptance and confirmation</li>
              <li>• Payment must be made before order processing</li>
              <li>• We accept M-Pesa, card payments, and cash on delivery</li>
              <li>• Failed payments will result in order cancellation</li>
              <li>• Price includes VAT where applicable</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">4. Delivery & Shipping</h2>
            <ul className="text-gray-700 space-y-2">
              <li>• Delivery times are estimates and not guarantees</li>
              <li>• We are not responsible for delays beyond our control (weather, strikes, etc.)</li>
              <li>• Risk of loss passes to you upon delivery</li>
              <li>• Delivery fees are non-refundable unless order is cancelled</li>
              <li>• See our Shipping page for detailed delivery information</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
            <ul className="text-gray-700 space-y-2">
              <li>• All website content is proprietary to Jersey Code</li>
              <li>• Trademarks and logos are protected intellectual property</li>
              <li>• Unauthorized reproduction is prohibited</li>
              <li>• Sports team trademarks remain property of respective organizations</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              To the fullest extent permitted by law, Jersey Code shall not be liable for:
            </p>
            <ul className="text-gray-700 space-y-2">
              <li>• Indirect, incidental, or consequential damages</li>
              <li>• Lost profits or business interruption</li>
              <li>• Damages from unauthorized access or data breaches</li>
              <li>• Any other damages arising from your use of our services</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">8. User Conduct</h2>
            <p className="text-gray-700 mb-4">You agree not to:</p>
            <ul className="text-gray-700 space-y-2">
              <li>• Violate any applicable laws or regulations</li>
              <li>• Engage in fraudulent or deceptive practices</li>
              <li>• Harass or abuse our staff or other customers</li>
              <li>• Attempt to hack or access our systems unauthorized</li>
              <li>• Use automation to scrape or collect data</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">9. Privacy</h2>
            <p className="text-gray-700">
              Your privacy is important to us. We collect and use personal information in accordance with applicable data protection laws. Your data will not be shared with third parties without consent, except as necessary to fulfill your order.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">10. Modifications</h2>
            <p className="text-gray-700">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of our services constitutes acceptance of modified terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
            <p className="text-gray-700">
              These terms are governed by the laws of Kenya. Any disputes shall be resolved in the courts of Kenya.
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-4">Questions About These Terms?</h3>
            <p className="text-gray-700">
              Contact us at support@jerseystore.co.ke
            </p>
          </div>
        </div>

        <p className="text-gray-600 text-sm mt-8 text-center">
          Last Updated: July 2026
        </p>
      </div>
    </div>
  );
}
