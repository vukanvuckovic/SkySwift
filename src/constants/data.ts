export const sliderImages = [
  "/slider/1.jpg",
  "/slider/2.jpg",
  "/slider/3.jpg",
  "/slider/4.jpg",
  "/slider/5.jpg",
];

export const flightClasses = [
  {
    name: "Basic",
    options: ["1 piece x 8 kg cabin baggage allowance"],
    price: 150,
    color: "gray",
  },
  {
    name: "Ecojet",
    options: [
      "1 piece x 8 kg cabin baggage allowance",
      "20 kg baggage allowance",
      "Reissue with penalty",
    ],
    price: 200,
    color: "blue",
  },
  {
    name: "Flex",
    options: [
      "1 piece x 8 kg cabin baggage allowance",
      "20 kg baggage allowance",
      "Reissue with penalty",
      "Standard seat selection",
      "Refund with penalty",
    ],
    price: 250,
    color: "green",
  },
  {
    name: "Premium",
    options: [
      "1 piece x 8 kg cabin baggage allowance",
      "25 kg baggage allowance",
      "Premium seat selection",
      "Reissue without penalty",
      "Prior to departure",
      "Flexible Refund(Before Departure)",
    ],
    price: 150,
    color: "purple",
  },
];

export const airplaneData = {
  name: "Airbus A320",
  ailes: ["A", "B", "C", "D", "E", "F"],
  seats: [
    {
      name: "Front Seat Premium",
      price: 350,
      benefits: [
        "Extra leg room",
        "Priority boarding and alighting",
        "Catering start point",
      ],
      rowsFrom: 1,
      rowsTo: 1,
    },
    {
      name: "Front Seat",
      price: 250,
      benefits: ["Priority boarding and alighting", "Catering start point"],
      rowsFrom: 2,
      rowsTo: 7,
    },
    {
      name: "Front Seat",
      price: 200,
      benefits: ["Window, aisle, middle seat"],
      rowsFrom: 8,
      rowsTo: 11,
    },
    {
      name: "Emergency Exit",
      price: 300,
      benefits: ["Extra leg room", "Direct access to emergency exit"],
      rowsFrom: 12,
      rowsTo: 13,
    },
    {
      name: "Front Seat",
      price: 200,
      benefits: ["Window, aisle, middle seat"],
      rowsFrom: 14,
      rowsTo: 15,
    },
    {
      name: "Standard",
      price: 150,
      benefits: [
        "Window, aisle, middle seat",
        "Choose the one you want",
        "The best offer for those who want to coexist",
      ],
      rowsFrom: 16,
      rowsTo: 30,
    },
  ],
};

export const additionalServices = {
  meals: [
    {
      name: "Vegan",
      price: 25,
      img: "/additional-services/meals/vegan.jpg",
    },
    {
      name: "Vegetarian",
      price: 30,
      img: "/additional-services/meals/vegetarian.jpg",
    },
    {
      name: "Halal",
      price: 27,
      img: "/additional-services/meals/halal.jpg",
    },
    {
      name: "Standard",
      price: 22,
      img: "/additional-services/meals/standard.jpg",
    },
  ],
  luggage: [
    {
      name: "10kg Carry-On",
      price: 25,
      img: "/additional-services/luggage/10kg.jpg",
    },
    {
      name: "15kg Checked Baggage",
      price: 30,
      img: "/additional-services/luggage/20kg.jpg",
    },
    {
      name: "20kg Checked Baggage",
      price: 35,
      img: "/additional-services/luggage/30kg.jpg",
    },
  ],
};

export const serviceCardInfo = {
  meals: {
    title: "Meal Selection",
    desc: "Add a meal without going to the airport.",
    thumbanil: "/additional-services/meals/thumbnail.jpg",
  },
  luggage: {
    title: "Additional Luggage",
    desc: "Bring as much stuff as you could possibly need.",
    thumbanil: "/additional-services/luggage/thumbnail.jpg",
  },
};

export const faqData = [
  {
    id: "item-1",
    question: "How do I book a flight?",
    answer:
      "You can book a flight by searching for your desired destination, selecting a flight, and completing the checkout process.",
  },
  {
    id: "item-2",
    question: "Can I cancel or change my booking?",
    answer:
      "Yes, you can modify or cancel your booking through your account dashboard. Cancellation fees may apply depending on the airline's policy.",
  },
  {
    id: "item-3",
    question: "What payment methods do you accept?",
    answer:
      "We accept credit/debit cards, PayPal, and other secure payment options.",
  },
  {
    id: "item-4",
    question: "How do I receive my ticket?",
    answer:
      "Once your booking is confirmed, your e-ticket will be sent to your registered email.",
  },
  {
    id: "item-5",
    question: "Do you offer refunds?",
    answer:
      "Refund policies vary by airline. Please check the airline's cancellation policy before booking.",
  },
  {
    id: "item-6",
    question: "What happens if my flight is delayed or canceled?",
    answer:
      "If your flight is delayed or canceled, the airline will notify you about your options, including rebooking or refund options.",
  },
  {
    id: "item-7",
    question: "Can I book a flight for someone else?",
    answer:
      "Yes, you can book a flight for someone else by entering their information during checkout.",
  },
  {
    id: "item-8",
    question: "Do I need to print my ticket?",
    answer:
      "No, you can show your e-ticket on your phone at the airport check-in counter.",
  },
  {
    id: "item-9",
    question: "How early should I arrive at the airport?",
    answer:
      "It's recommended to arrive at least 2 hours before domestic flights and 3 hours before international flights.",
  },
  {
    id: "item-10",
    question: "Can I select my seat in advance?",
    answer:
      "Yes, you can select your seat during booking or through the airline's website after booking.",
  },
];
