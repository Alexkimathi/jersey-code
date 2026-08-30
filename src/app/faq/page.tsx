import Link from 'next/link';

export default function FAQPage() {
  const faqs = [
    {
      category: 'Orders & Shipping',
      items: [
        {
          q: 'How long does delivery take?',
          a: 'Standard delivery within Nairobi is same day. For other areas outside Nairobi, delivery takes 1–2 business days. Express delivery (Nairobi only) is also same day.',
        },
        {
          q: 'Do you offer pickup?',
          a: 'Yes! You can choose store pickup at checkout. Pickup is available from our Nairobi CBD store only — Tom Mboya St, next to Platinum Plaza, 1st floor shop C13.',
        },
        {
          q: 'How can I track my order?',
          a: 'Visit our Order Tracking page, enter your phone number, and you\'ll see real-time updates on your order status.',
        },
        {
          q: 'What are your delivery charges?',
          a: 'Standard delivery within Nairobi costs KSh 100–150. Other areas cost KSh 100–300. Express delivery in Nairobi costs KSh 250–800. Orders above KSh 10,000 get free standard delivery.',
        },
      ],
    },
    {
      category: 'Products & Sizing',
      items: [
        {
          q: 'How do I know what size to order?',
          a: 'Each product has a detailed size guide. We recommend measuring your chest and comparing with our size chart. Most jerseys are unisex.',
        },
        {
          q: 'Are jerseys authentic?',
          a: 'Yes, all jerseys are officially licensed. We source from authorized distributors to ensure authenticity.',
        },
        {
          q: 'Can I customize jerseys?',
          a: 'Yes! Many jerseys can be customized with player names and numbers. Select the customization option during checkout.',
        },
        {
          q: 'What\'s the material?',
          a: 'Most jerseys are made from breathable polyester blend fabric designed for comfort and durability. Check individual product descriptions for details.',
        },
      ],
    },
    {
      category: 'Payment & Security',
      items: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept M-Pesa, card payments, and cash on delivery for qualifying locations.',
        },
        {
          q: 'Is my payment secure?',
          a: 'Yes, all payments are processed through secure encrypted channels. We use industry-standard security protocols.',
        },
        {
          q: 'Can I pay on delivery?',
          a: 'Yes, cash on delivery is available for most areas. A delivery fee may apply.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-600 mb-12">
          Find answers to common questions about orders, products, and more.
        </p>

        <div className="space-y-12">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="text-2xl font-semibold mb-6">{section.category}</h2>
              <div className="space-y-4">
                {section.items.map((item, idx) => (
                  <details
                    key={idx}
                    className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    <summary className="font-semibold cursor-pointer text-lg">
                      {item.q}
                    </summary>
                    <p className="text-gray-700 mt-4">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 p-8 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Didn't find your answer?</h3>
          <p className="text-gray-700 mb-6">
            Our support team is here to help. Reach out to us on the{' '}
            <Link href="/contact" className="text-blue-600 hover:underline">
              contact page
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
